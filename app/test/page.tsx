"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import * as THREE from "three"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const WORLD_WIDTH = 256
const WORLD_DEPTH = 256
const TERRAIN_SIZE = 7500
const TERRAIN_HEIGHT_SCALE = 10
const TERRAIN_TILE_RADIUS = 2
type SceneMode = "desert" | "meadow"

function makeSeededRandom(seedStart = Math.PI / 4) {
  let seed = seedStart
  return () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
}

function generateHeight(width: number, depth: number) {
  const random = makeSeededRandom()
  const size = width * depth
  const data = new Uint8Array(size)
  const noise = new ImprovedNoise()
  const z = random() * 100

  let quality = 1
  for (let layer = 0; layer < 4; layer += 1) {
    for (let i = 0; i < size; i += 1) {
      const x = i % width
      const y = Math.floor(i / width)
      data[i] += Math.abs(noise.noise(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= 5
  }

  // Make opposite edges identical so terrain tiles stitch seamlessly.
  for (let z = 0; z < depth; z += 1) {
    data[z * width + (width - 1)] = data[z * width]
  }
  for (let x = 0; x < width; x += 1) {
    data[(depth - 1) * width + x] = data[x]
  }
  data[(depth - 1) * width + (width - 1)] = data[0]

  return data
}

function generateTexture(data: Uint8Array, width: number, height: number, mode: SceneMode) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, width, height)

  const image = ctx.getImageData(0, 0, width, height)
  const imageData = image.data

  const normal = new THREE.Vector3()
  const sun =
    mode === "desert"
      ? new THREE.Vector3(-0.7, 0.65, 0.45).normalize()
      : new THREE.Vector3(0.85, 1.15, 0.35).normalize()

  for (let i = 0, j = 0; i < imageData.length; i += 4, j += 1) {
    normal.x = (data[j - 2] ?? data[j]) - (data[j + 2] ?? data[j])
    normal.y = 2
    normal.z = (data[j - width * 2] ?? data[j]) - (data[j + width * 2] ?? data[j])
    normal.normalize()

    const shade = normal.dot(sun)
    const elevation = 0.5 + data[j] * 0.007

    if (mode === "desert") {
      // Golden-hour desert: brighter warm highlights.
      imageData[i] = (132 + shade * 138) * elevation
      imageData[i + 1] = (104 + shade * 94) * elevation
      imageData[i + 2] = (64 + shade * 56) * elevation
    } else {
      // Meadow palette: softer olive/sage greens for a more premium natural tone.
      imageData[i] = (92 + shade * 70) * elevation
      imageData[i + 1] = (128 + shade * 98) * elevation
      imageData[i + 2] = (92 + shade * 62) * elevation
    }
    imageData[i + 3] = 255
  }

  ctx.putImageData(image, 0, 0)

  // Scale up texture for crisp terrain detail.
  const scaled = document.createElement("canvas")
  scaled.width = width * 4
  scaled.height = height * 4
  const scaledCtx = scaled.getContext("2d")
  if (!scaledCtx) return canvas

  scaledCtx.scale(4, 4)
  scaledCtx.drawImage(canvas, 0, 0)

  const noiseImage = scaledCtx.getImageData(0, 0, scaled.width, scaled.height)
  const noiseData = noiseImage.data
  const random = makeSeededRandom(42)

  for (let i = 0; i < noiseData.length; i += 4) {
    const grain = Math.floor(random() * 5)
    noiseData[i] += grain
    noiseData[i + 1] += grain
    noiseData[i + 2] += grain
  }

  scaledCtx.putImageData(noiseImage, 0, 0)
  return scaled
}

function sampleTerrainHeightAtWorld(heightData: Uint8Array, worldX: number, worldZ: number) {
  const mod = (value: number, base: number) => ((value % base) + base) % base

  // Convert world position into repeating tile-local UV coordinates.
  const localX = mod(worldX + TERRAIN_SIZE / 2, TERRAIN_SIZE)
  const localZ = mod(worldZ + TERRAIN_SIZE / 2, TERRAIN_SIZE)
  const fx = (localX / TERRAIN_SIZE) * (WORLD_WIDTH - 1)
  const fz = (localZ / TERRAIN_SIZE) * (WORLD_DEPTH - 1)

  const x0 = Math.floor(fx)
  const z0 = Math.floor(fz)
  const x1 = Math.min(x0 + 1, WORLD_WIDTH - 1)
  const z1 = Math.min(z0 + 1, WORLD_DEPTH - 1)
  const tx = fx - x0
  const tz = fz - z0

  const i00 = z0 * WORLD_WIDTH + x0
  const i10 = z0 * WORLD_WIDTH + x1
  const i01 = z1 * WORLD_WIDTH + x0
  const i11 = z1 * WORLD_WIDTH + x1

  // Bilinear interpolation prevents harsh "step" clamping.
  const h00 = heightData[i00] * TERRAIN_HEIGHT_SCALE
  const h10 = heightData[i10] * TERRAIN_HEIGHT_SCALE
  const h01 = heightData[i01] * TERRAIN_HEIGHT_SCALE
  const h11 = heightData[i11] * TERRAIN_HEIGHT_SCALE
  const hx0 = h00 + (h10 - h00) * tx
  const hx1 = h01 + (h11 - h01) * tx
  return hx0 + (hx1 - hx0) * tz
}

function createCircleSpriteTexture(size = 64) {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const r = size / 2
  const gradient = ctx.createRadialGradient(r, r, 1, r, r, r)
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.6, "rgba(255,255,255,0.9)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(r, r, r, 0, Math.PI * 2)
  ctx.fill()

  return canvas
}

function createSunGlowTexture(size = 256) {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const r = size / 2
  const gradient = ctx.createRadialGradient(r, r, 2, r, r, r)
  gradient.addColorStop(0, "rgba(255,255,240,1)")
  gradient.addColorStop(0.3, "rgba(255,232,180,0.95)")
  gradient.addColorStop(0.65, "rgba(255,190,120,0.45)")
  gradient.addColorStop(1, "rgba(255,170,90,0)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(r, r, r, 0, Math.PI * 2)
  ctx.fill()

  return canvas
}

export default function TestPage() {
  const mountRef = useRef<HTMLDivElement>(null)
  const introFireflyRef = useRef<HTMLDivElement>(null)
  const startBgmFnRef = useRef<() => void>(() => {})
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const bgmStartedRef = useRef(false)
  const mutedRef = useRef(false)
  const [sceneMode, setSceneMode] = useState<SceneMode>("meadow")
  const sceneModeRef = useRef<SceneMode>("meadow")
  const [isMuted, setIsMuted] = useState(false)
  const [showHero, setShowHero] = useState(true)
  const [heroExiting, setHeroExiting] = useState(false)
  const [isIntroActive, setIsIntroActive] = useState(false)
  const [introTextVisible, setIntroTextVisible] = useState(false)
  const [hasStartedIntro, setHasStartedIntro] = useState(false)
  const [showControlsHint, setShowControlsHint] = useState(false)
  const [needsAudioStart, setNeedsAudioStart] = useState(true)
  const startIntroRef = useRef(false)
  const arrowHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleAudio = () => {
    const nextMuted = !mutedRef.current
    mutedRef.current = nextMuted
    setIsMuted(nextMuted)

    const bgm = bgmRef.current
    if (!bgm) return
    if (nextMuted) {
      bgm.pause()
    } else {
      startBgmFnRef.current()
    }
  }

  useEffect(() => {
    sceneModeRef.current = sceneMode
  }, [sceneMode])

  useEffect(() => {
    const t = window.setTimeout(() => setIntroTextVisible(true), 90)
    return () => window.clearTimeout(t)
  }, [])

  // Show controls hint again when user presses arrow keys (reminder how to move).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isArrow = e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight"
      if (!isArrow || !hasStartedIntro || isIntroActive) return
      setShowControlsHint(true)
      window.clearTimeout(arrowHintTimeoutRef.current)
      arrowHintTimeoutRef.current = window.setTimeout(() => setShowControlsHint(false), 4500)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.clearTimeout(arrowHintTimeoutRef.current)
    }
  }, [hasStartedIntro, isIntroActive])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const flowersGroup = new THREE.Group()
    flowersGroup.visible = false
    scene.add(flowersGroup)
    const grassGroup = new THREE.Group()
    grassGroup.visible = false
    scene.add(grassGroup)
    const flowersPackGroup = new THREE.Group()
    flowersPackGroup.visible = false
    scene.add(flowersPackGroup)
    const mushroomsGroup = new THREE.Group()
    mushroomsGroup.visible = false
    scene.add(mushroomsGroup)
    const natureGroup = new THREE.Group()
    natureGroup.visible = false
    scene.add(natureGroup)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(100, 800, -800)
    camera.lookAt(-100, 810, -800)

    // Lighting for GLB assets (flowers/grass/mushrooms/nature pack).
    const ambientLight = new THREE.HemisphereLight(0xfff0cf, 0x6d4d38, 0.78)
    scene.add(ambientLight)
    const sunLight = new THREE.DirectionalLight(0xffd8a8, 1.18)
    sunLight.position.set(-1500, 1900, 1200)
    scene.add(sunLight)

    const heightData = generateHeight(WORLD_WIDTH, WORLD_DEPTH)
    const geometry = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, WORLD_WIDTH - 1, WORLD_DEPTH - 1)
    geometry.rotateX(-Math.PI / 2)

    const vertices = geometry.attributes.position.array as Float32Array
    for (let i = 0, j = 0; i < heightData.length; i += 1, j += 3) {
      vertices[j + 1] = heightData[i] * TERRAIN_HEIGHT_SCALE
    }
    geometry.computeVertexNormals()

    const desertTexture = new THREE.CanvasTexture(generateTexture(heightData, WORLD_WIDTH, WORLD_DEPTH, "desert"))
    desertTexture.wrapS = THREE.RepeatWrapping
    desertTexture.wrapT = THREE.RepeatWrapping
    desertTexture.colorSpace = THREE.SRGBColorSpace

    const meadowTexture = new THREE.CanvasTexture(generateTexture(heightData, WORLD_WIDTH, WORLD_DEPTH, "meadow"))
    meadowTexture.wrapS = THREE.RepeatWrapping
    meadowTexture.wrapT = THREE.RepeatWrapping
    meadowTexture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({
      map: sceneModeRef.current === "meadow" ? meadowTexture : desertTexture,
    })
    const terrainTiles: THREE.Mesh[] = []
    for (let tileZ = -TERRAIN_TILE_RADIUS; tileZ <= TERRAIN_TILE_RADIUS; tileZ += 1) {
      for (let tileX = -TERRAIN_TILE_RADIUS; tileX <= TERRAIN_TILE_RADIUS; tileX += 1) {
        const tile = new THREE.Mesh(geometry, material)
        tile.position.set(tileX * TERRAIN_SIZE, 0, tileZ * TERRAIN_SIZE)
        terrainTiles.push(tile)
        scene.add(tile)
      }
    }

    const assetLoader = new GLTFLoader()
    assetLoader.load(
      "/models/low_poly_flower.glb",
      (gltf) => {
        const flowerPrototype = gltf.scene
        flowerPrototype.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(flowerPrototype)
        const modelHeight = Math.max(0.001, box.max.y - box.min.y)
        const baseScale = 18 / modelHeight

        const FLOWER_COUNT = 420
        const FLOWER_SPREAD = TERRAIN_SIZE * 0.95
        for (let i = 0; i < FLOWER_COUNT; i += 1) {
          const flower = flowerPrototype.clone(true)
          const x = (Math.random() - 0.5) * FLOWER_SPREAD * 2
          const z = (Math.random() - 0.5) * FLOWER_SPREAD * 2
          const y = sampleTerrainHeightAtWorld(heightData, x, z) + 6
          const scale = baseScale * (0.82 + Math.random() * 0.35)
          flower.position.set(x, y, z)
          flower.scale.setScalar(scale)
          flower.rotation.y = Math.random() * Math.PI * 2
          flowersGroup.add(flower)
        }
      },
      undefined,
      () => {
        // Keep meadow mode functional even if model load fails.
      },
    )

    const scatterModel = (
      prototype: THREE.Object3D,
      targetGroup: THREE.Group,
      options: {
        count: number
        spread: number
        yOffset: number
        targetHeight: number
        scaleJitter: number
      },
    ) => {
      prototype.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(prototype)
      const modelHeight = Math.max(0.001, box.max.y - box.min.y)
      const baseScale = options.targetHeight / modelHeight

      for (let i = 0; i < options.count; i += 1) {
        const x = (Math.random() - 0.5) * options.spread * 2
        const z = (Math.random() - 0.5) * options.spread * 2
        const y = sampleTerrainHeightAtWorld(heightData, x, z) + options.yOffset
        const scale = baseScale * (1 - options.scaleJitter + Math.random() * options.scaleJitter * 2)
        const object = prototype.clone(true)
        object.position.set(x, y, z)
        object.scale.setScalar(scale)
        object.rotation.y = Math.random() * Math.PI * 2
        targetGroup.add(object)
      }
    }

    assetLoader.load(
      "/models/low_poly_flowers.glb",
      (gltf) => {
        scatterModel(gltf.scene, flowersPackGroup, {
          count: 220,
          spread: TERRAIN_SIZE * 0.95,
          yOffset: 6,
          targetHeight: 22,
          scaleJitter: 0.25,
        })
      },
      undefined,
      () => {
        // Optional meadow decoration.
      },
    )

    assetLoader.load(
      "/models/low_poly_grass_pack.glb",
      (gltf) => {
        scatterModel(gltf.scene, grassGroup, {
          // Dense grass coverage from the asset pack.
          count: 4200,
          spread: TERRAIN_SIZE * 1.55,
          yOffset: 5,
          targetHeight: 22,
          scaleJitter: 0.38,
        })
      },
      undefined,
      () => {
        // Optional meadow decoration.
      },
    )

    assetLoader.load(
      "/models/low_poly_mushrooms_amanita_muscaria.glb",
      (gltf) => {
        scatterModel(gltf.scene, mushroomsGroup, {
          count: 160,
          spread: TERRAIN_SIZE * 0.95,
          yOffset: 4,
          targetHeight: 18,
          scaleJitter: 0.4,
        })
      },
      undefined,
      () => {
        // Optional meadow decoration.
      },
    )

    assetLoader.load(
      "/models/low_poly_nature_pack.glb",
      (gltf) => {
        scatterModel(gltf.scene, natureGroup, {
          count: 80,
          spread: TERRAIN_SIZE * 0.95,
          yOffset: 6,
          targetHeight: 320,
          scaleJitter: 0.3,
        })
      },
      undefined,
      () => {
        // Optional meadow decoration.
      },
    )

    const PARTICLE_COUNT = 260
    const PARTICLE_SPREAD = 520
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleBase = new Float32Array(PARTICLE_COUNT * 3)
    const particleColorBase = new Float32Array(PARTICLE_COUNT * 3)
    const particleColors = new Float32Array(PARTICLE_COUNT * 3)
    const particlePhase = new Float32Array(PARTICLE_COUNT)
    const particleSpeed = new Float32Array(PARTICLE_COUNT)
    const particleSwayX = new Float32Array(PARTICLE_COUNT)
    const particleSwayY = new Float32Array(PARTICLE_COUNT)
    const particleSwayZ = new Float32Array(PARTICLE_COUNT)
    const particleRiseSpeed = new Float32Array(PARTICLE_COUNT)
    const particleRiseOffset = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const idx = i * 3
      const x = (Math.random() - 0.5) * PARTICLE_SPREAD * 2
      const y = Math.random() * (PARTICLE_SPREAD * 0.7) - 60
      const z = (Math.random() - 0.5) * PARTICLE_SPREAD * 2
      particleBase[idx] = x
      particleBase[idx + 1] = y
      particleBase[idx + 2] = z
      particlePositions[idx] = x
      particlePositions[idx + 1] = y
      particlePositions[idx + 2] = z
      particlePhase[i] = Math.random() * Math.PI * 2
      particleSpeed[i] = 0.35 + Math.random() * 1.05
      particleSwayX[i] = 8 + Math.random() * 24
      particleSwayY[i] = 4 + Math.random() * 14
      particleSwayZ[i] = 10 + Math.random() * 26
      particleRiseSpeed[i] = 3 + Math.random() * 8
      particleRiseOffset[i] = Math.random() * 240

      // Warm firefly/spark palette with slight per-particle variation.
      const warmth = Math.random()
      const r = 1
      const g = 0.82 + warmth * 0.17
      const b = 0.5 + warmth * 0.3
      particleColorBase[idx] = r
      particleColorBase[idx + 1] = g
      particleColorBase[idx + 2] = b
      particleColors[idx] = r
      particleColors[idx + 1] = g
      particleColors[idx + 2] = b
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))
    const particleSpriteTexture = new THREE.CanvasTexture(createCircleSpriteTexture())
    particleSpriteTexture.colorSpace = THREE.SRGBColorSpace
    const particleMaterial = new THREE.PointsMaterial({
      map: particleSpriteTexture,
      size: 6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.52,
      vertexColors: true,
      alphaTest: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const sunTexture = new THREE.CanvasTexture(createSunGlowTexture())
    sunTexture.colorSpace = THREE.SRGBColorSpace
    const sunCoreMaterial = new THREE.SpriteMaterial({
      map: sunTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      depthTest: false,
    })
    const sunHaloMaterial = new THREE.SpriteMaterial({
      map: sunTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      depthTest: false,
    })
    const sunCore = new THREE.Sprite(sunCoreMaterial)
    const sunHalo = new THREE.Sprite(sunHaloMaterial)
    scene.add(sunHalo)
    scene.add(sunCore)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.touchAction = "none"
    mount.appendChild(renderer.domElement)

    // Keep music ready; actual playback starts from explicit user action.
    const bgm = new Audio("/audio/tranquility.mp3")
    bgm.loop = true
    bgm.volume = 0.22
    bgm.preload = "auto"
    bgmRef.current = bgm
    bgm.muted = mutedRef.current
    const startBgm = () => {
      if (mutedRef.current) return
      if (!bgmStartedRef.current) {
        try {
          bgm.currentTime = 1.5
        } catch {
          // Ignore seek errors before metadata is available.
        }
        bgmStartedRef.current = true
      }
      setNeedsAudioStart(false)
      void bgm.play().catch(() => {
        // Ignore blocked-play promise; next interaction will retry.
      })
    }
    startBgmFnRef.current = startBgm

    const clock = new THREE.Clock()

    // Start angles based on the camera's initial view direction.
    const startDirection = new THREE.Vector3()
    camera.getWorldDirection(startDirection)
    let yaw = Math.atan2(startDirection.z, startDirection.x)
    let pitch = Math.asin(startDirection.y)

    const direction = new THREE.Vector3()
    const lookTarget = new THREE.Vector3()
    const flatForward = new THREE.Vector3()
    const flatRight = new THREE.Vector3()

    const WALK_SPEED = 980
    const TURN_SPEED = 1.6
    const HEIGHT_SPEED = 115
    const HEIGHT_INPUT_DEADZONE = 0.32
    const HEIGHT_INPUT_SCALE = 0.12
    const AUTOPILOT_DURATION = 8.2
    const INTRO_REVEAL_PHASE = 0.42
    const CAMERA_GROUND_CLEARANCE = 22
    const DAY_NIGHT_CYCLE_SECONDS = 60
    const RELEASE_DECAY_PER_SECOND = 4.2

    const joystickTarget = { x: 0, y: 0 }
    const joystickSmooth = { x: 0, y: 0 }
    const JOYSTICK_RADIUS = 44

    const centerVirtualJoystick = () => {
      joystickTarget.x = 0
      joystickTarget.y = 0
      joystickSmooth.x = 0
      joystickSmooth.y = 0
    }

    let isPointerDown = false
    let dragStartX = 0
    let dragStartY = 0
    let particleTime = 0
    let autopilotTime = 0
    let isAutopilotActive = false
    let hasStartedIntroLocal = false
    let didAnnounceIntroComplete = false
    let heroHideTimeout: number | null = null

    const autopilotBasePosition = camera.position.clone()
    const autopilotBaseYaw = yaw
    const autopilotBasePitch = pitch
    const autopilotStartPosition = autopilotBasePosition.clone().add(new THREE.Vector3(-1500, 420, -2200))
    const autopilotEndPosition = autopilotBasePosition.clone().add(new THREE.Vector3(180, 28, 320))
    const autopilotTargetVec = new THREE.Vector3()
    let targetFov = camera.fov

    const meadowSkyDay = new THREE.Color(0xdcf1ff)
    const meadowSkySunset = new THREE.Color(0xffc792)
    const meadowSkyNight = new THREE.Color(0xcfe8ff) // still daylight, just cooler
    const meadowFogDay = new THREE.Color(0xeaf7ff)
    const meadowFogSunset = new THREE.Color(0xffd2ac)
    const meadowFogNight = new THREE.Color(0xdceeff) // still daylight haze
    const meadowSunDay = new THREE.Color(0xfff6de)
    const meadowSunSunset = new THREE.Color(0xffcb98)
    const meadowSunNight = new THREE.Color(0xffe6c7) // warm daylight instead of moonlight
    const meadowAmbientNight = new THREE.Color(0xe4f0ff)
    const meadowAmbientDay = new THREE.Color(0xf6fbff)
    const meadowGroundNight = new THREE.Color(0x7ea06f)
    const meadowGroundDay = new THREE.Color(0x93b48a)
    const colorBlendA = new THREE.Color()
    const colorBlendB = new THREE.Color()
    const colorBlendC = new THREE.Color()

    const applySceneMode = (mode: SceneMode) => {
      if (mode === "desert") {
        scene.background = new THREE.Color(0xffcf9b)
        scene.fog = new THREE.FogExp2(0xffb77a, 0.00105)
        material.map = desertTexture
        flowersGroup.visible = false
        grassGroup.visible = false
        flowersPackGroup.visible = false
        mushroomsGroup.visible = false
        natureGroup.visible = false
        sunCoreMaterial.opacity = 0.98
        sunHaloMaterial.opacity = 0.52
        ambientLight.color.set(0xffefcf)
        ambientLight.groundColor.set(0x7a533a)
        ambientLight.intensity = 0.82
        sunLight.color.set(0xffd8a8)
        sunLight.intensity = 1.22
      } else {
        // Meadow as bright white-summer daylight.
        scene.background = new THREE.Color(0xdcf1ff)
        scene.fog = new THREE.FogExp2(0xeaf7ff, 0.0009)
        material.map = meadowTexture
        flowersGroup.visible = true
        grassGroup.visible = true
        flowersPackGroup.visible = true
        mushroomsGroup.visible = true
        natureGroup.visible = true
        sunCoreMaterial.opacity = 0.88
        sunHaloMaterial.opacity = 0.4
        ambientLight.color.set(0xf6fbff)
        ambientLight.groundColor.set(0x93b48a)
        ambientLight.intensity = 0.98
        sunLight.color.set(0xfff6de)
        sunLight.intensity = 1.12
      }
      material.needsUpdate = true
    }

    let activeSceneMode = sceneModeRef.current
    applySceneMode(activeSceneMode)

    // Ensure deterministic centered resting state on load/hot-reload.
    centerVirtualJoystick()

    const updateCameraLook = () => {
      direction.set(
        Math.cos(pitch) * Math.cos(yaw),
        Math.sin(pitch),
        Math.cos(pitch) * Math.sin(yaw),
      )
      lookTarget.copy(camera.position).add(direction)
      camera.lookAt(lookTarget)
    }

    updateCameraLook()

    const updateJoystickTarget = (dx: number, dy: number) => {
      const distance = Math.hypot(dx, dy)
      const clamped = Math.min(distance, JOYSTICK_RADIUS)
      const scale = distance > 0 ? clamped / distance : 0

      joystickTarget.x = dx * scale
      joystickTarget.y = dy * scale
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!hasStartedIntroLocal) return
      if (isAutopilotActive) return
      setShowControlsHint(false)
      isPointerDown = true
      dragStartX = event.clientX
      dragStartY = event.clientY
      centerVirtualJoystick()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!hasStartedIntroLocal) return
      if (isAutopilotActive) return
      if (!isPointerDown) return
      const dx = event.clientX - dragStartX
      const dy = event.clientY - dragStartY
      updateJoystickTarget(dx, dy)
    }

    const onPointerUp = () => {
      isPointerDown = false
      // Keep a bit of momentum so release eases out naturally.
      joystickTarget.x = joystickSmooth.x * 0.9
      joystickTarget.y = joystickSmooth.y * 0.9
    }

    const onPointerLeave = () => {
      isPointerDown = false
      // Same momentum behavior when leaving canvas.
      joystickTarget.x = joystickSmooth.x * 0.9
      joystickTarget.y = joystickSmooth.y * 0.9
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (isAutopilotActive) return
      // Scroll up = zoom in (smaller FOV), scroll down = zoom out.
      targetFov = THREE.MathUtils.clamp(targetFov + event.deltaY * 0.03, 30, 92)
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown)
    renderer.domElement.addEventListener("pointermove", onPointerMove)
    renderer.domElement.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("pointerup", onPointerUp)
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false })

    let frameId = 0
    const render = () => {
      const delta = clock.getDelta()
      particleTime += delta

      // Start intro when user clicked Start (audio + intro trigger).
      if (startIntroRef.current && !hasStartedIntroLocal) {
        startIntroRef.current = false
        hasStartedIntroLocal = true
        isAutopilotActive = true
        setHasStartedIntro(true)
        setShowControlsHint(false)
        setIsIntroActive(true)
        setHeroExiting(true)
        heroHideTimeout = window.setTimeout(() => setShowHero(false), 700)
      }

      if (sceneModeRef.current !== activeSceneMode) {
        activeSceneMode = sceneModeRef.current
        applySceneMode(activeSceneMode)
      }

      if (activeSceneMode === "meadow") {
        const phase = (particleTime % DAY_NIGHT_CYCLE_SECONDS) / DAY_NIGHT_CYCLE_SECONDS
        const theta = phase * Math.PI * 2
        const dayness = 0.5 + 0.5 * Math.cos(theta) // 1 at day, 0 at night
        const sunsetness = Math.pow(Math.abs(Math.sin(theta)), 1.35) // peaks at sunrise/sunset

        colorBlendA.copy(meadowSkyNight).lerp(meadowSkyDay, dayness)
        colorBlendB.copy(colorBlendA).lerp(meadowSkySunset, sunsetness * 0.52)
        if (scene.background instanceof THREE.Color) scene.background.copy(colorBlendB)

        if (scene.fog instanceof THREE.FogExp2) {
          colorBlendA.copy(meadowFogNight).lerp(meadowFogDay, dayness)
          colorBlendC.copy(colorBlendA).lerp(meadowFogSunset, sunsetness * 0.45)
          scene.fog.color.copy(colorBlendC)
          scene.fog.density = 0.00118 - dayness * 0.00034 + sunsetness * 0.00011
        }

        // Keep meadow in daylight the whole cycle (no dark/night phase).
        ambientLight.intensity = 0.72 + dayness * 0.36 + sunsetness * 0.1
        colorBlendA.copy(meadowAmbientNight).lerp(meadowAmbientDay, dayness)
        ambientLight.color.copy(colorBlendA)
        colorBlendA.copy(meadowGroundNight).lerp(meadowGroundDay, dayness)
        ambientLight.groundColor.copy(colorBlendA)

        colorBlendA.copy(meadowSunNight).lerp(meadowSunDay, dayness)
        colorBlendB.copy(colorBlendA).lerp(meadowSunSunset, sunsetness * 0.85)
        sunLight.color.copy(colorBlendB)
        sunLight.intensity = 0.8 + dayness * 0.62 + sunsetness * 0.24

        sunCoreMaterial.opacity = Math.min(0.95, 0.14 + dayness * 0.52 + sunsetness * 0.36)
        sunHaloMaterial.opacity = Math.min(0.7, 0.08 + dayness * 0.22 + sunsetness * 0.4)
      }

      const joystickEase = 0.18
      if (!isPointerDown && !isAutopilotActive) {
        // Exponential decay gives a smooth inertial stop.
        const decay = Math.exp(-RELEASE_DECAY_PER_SECOND * delta)
        joystickTarget.x *= decay
        joystickTarget.y *= decay
        if (Math.abs(joystickTarget.x) < 0.01) joystickTarget.x = 0
        if (Math.abs(joystickTarget.y) < 0.01) joystickTarget.y = 0
      }
      joystickSmooth.x += (joystickTarget.x - joystickSmooth.x) * joystickEase
      joystickSmooth.y += (joystickTarget.y - joystickSmooth.y) * joystickEase

      flatForward.set(Math.cos(yaw), 0, Math.sin(yaw)).normalize()
      flatRight.set(-flatForward.z, 0, flatForward.x).normalize()

      const inputX = joystickSmooth.x / JOYSTICK_RADIUS
      const inputY = joystickSmooth.y / JOYSTICK_RADIUS
      const step = WALK_SPEED * delta

      if (isAutopilotActive) {
        autopilotTime += delta
        const t = Math.min(autopilotTime / AUTOPILOT_DURATION, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2

        // Reverse intro motion: start far away and rush into scene.
        camera.position.lerpVectors(autopilotStartPosition, autopilotEndPosition, eased)
        camera.position.x += Math.sin(eased * Math.PI * 2.1) * 220 * (1 - eased * 0.7)
        camera.position.y += Math.sin(eased * Math.PI * 3.1) * 28 * (1 - eased * 0.45)

        autopilotTargetVec.copy(autopilotEndPosition).sub(camera.position).normalize()
        yaw = Math.atan2(autopilotTargetVec.z, autopilotTargetVec.x) + 0.12 * (1 - eased)
        pitch = Math.asin(autopilotTargetVec.y) - 0.04 + Math.sin(eased * Math.PI * 1.7) * 0.018

        // Firefly reveal: single light fades as scene is revealed.
        const reveal = Math.min(1, t / INTRO_REVEAL_PHASE)
        if (introFireflyRef.current) {
          introFireflyRef.current.style.opacity = `${Math.max(0, 1 - reveal * 0.9)}`
          const scale = 0.9 + reveal * 1.5
          introFireflyRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`
        }
        if (t >= 1) {
          isAutopilotActive = false
          if (introFireflyRef.current) introFireflyRef.current.style.opacity = "0"
          if (!didAnnounceIntroComplete) {
            didAnnounceIntroComplete = true
            setIsIntroActive(false)
            setShowControlsHint(true)
          }
        }
      } else {
        // Cursor direction steers camera left/right.
        yaw += inputX * TURN_SPEED * delta

        // Keep current view angle on release; only tilt while actively aiming.
        if (Math.abs(inputY) > 0.01) {
          const targetPitch = THREE.MathUtils.clamp(-inputY * 0.48, -0.7, 0.35)
          pitch += (targetPitch - pitch) * 0.08
        }

        // Fly toward where pointer is aiming (speed from distance to center).
        const aimStrength = Math.max(0, Math.hypot(inputX, inputY) - 0.06)
        const forwardStep = Math.pow(aimStrength, 1.08) * step * 2.4
        camera.position.addScaledVector(flatForward, forwardStep)
        // Keep mostly level flight: vertical change only after stronger up/down aim.
        const verticalInput =
          Math.abs(inputY) > HEIGHT_INPUT_DEADZONE
            ? inputY - Math.sign(inputY) * HEIGHT_INPUT_DEADZONE
            : 0
        camera.position.y += -verticalInput * HEIGHT_SPEED * delta * HEIGHT_INPUT_SCALE

      }

      const particlePosition = particleGeometry.getAttribute("position") as THREE.BufferAttribute
      const particleColor = particleGeometry.getAttribute("color") as THREE.BufferAttribute
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const idx = i * 3
        particlePhase[i] += delta * particleSpeed[i]
        const phase = particlePhase[i]
        const wobbleX =
          Math.sin(phase * 1.2 + particleBase[idx + 2] * 0.01) * particleSwayX[i] +
          Math.cos(phase * 0.55) * (particleSwayX[i] * 0.45)
        const wobbleY = Math.cos(phase * 1.7 + i * 0.19) * particleSwayY[i]
        const wobbleZ =
          Math.cos(phase * 1.1 + particleBase[idx] * 0.01) * particleSwayZ[i] +
          Math.sin(phase * 0.7) * (particleSwayZ[i] * 0.35)
        const rise = ((particleTime * particleRiseSpeed[i] + particleRiseOffset[i]) % 240) - 120

        particlePositions[idx] = particleBase[idx] + wobbleX
        particlePositions[idx + 1] = particleBase[idx + 1] + wobbleY + rise
        particlePositions[idx + 2] = particleBase[idx + 2] + wobbleZ

        // Per-particle twinkle (organic flicker, not uniform pulsing).
        const twinkle = 0.62 + 0.38 * Math.sin(phase * 2.4 + i * 0.31)
        particleColors[idx] = particleColorBase[idx] * twinkle
        particleColors[idx + 1] = particleColorBase[idx + 1] * twinkle
        particleColors[idx + 2] = particleColorBase[idx + 2] * twinkle
      }
      particlePosition.needsUpdate = true
      particleColor.needsUpdate = true
      // Keep particles around the viewer so they always feel nearby.
      particles.position.copy(camera.position)
      particles.position.y += 40

      // Keep a stylized sun in view for a stronger golden-hour vibe.
      const sunDistance = 3400
      const sunYawOffset = -0.95
      let sunY = 980
      if (activeSceneMode === "meadow") {
        const phase = (particleTime % DAY_NIGHT_CYCLE_SECONDS) / DAY_NIGHT_CYCLE_SECONDS
        const theta = phase * Math.PI * 2
        const altitude = 0.28 + 0.72 * (0.5 + 0.5 * Math.cos(theta)) // always above horizon
        sunY = 520 + altitude * 340
      }
      const sunX = camera.position.x + Math.cos(yaw + sunYawOffset) * sunDistance
      const sunZ = camera.position.z + Math.sin(yaw + sunYawOffset) * sunDistance
      sunCore.position.set(sunX, camera.position.y + sunY, sunZ)
      sunHalo.position.set(sunX, camera.position.y + sunY, sunZ)
      if (activeSceneMode === "desert") {
        sunCore.scale.setScalar(520)
        sunHalo.scale.setScalar(960)
      } else {
        const phase = (particleTime % DAY_NIGHT_CYCLE_SECONDS) / DAY_NIGHT_CYCLE_SECONDS
        const sunsetness = Math.pow(Math.abs(Math.sin(phase * Math.PI * 2)), 1.35)
        sunCore.scale.setScalar(500 + sunsetness * 80)
        sunHalo.scale.setScalar(900 + sunsetness * 160)
      }

      // Re-center a 3x3 tile grid around the camera for endless terrain.
      const centerTileX = Math.floor(camera.position.x / TERRAIN_SIZE)
      const centerTileZ = Math.floor(camera.position.z / TERRAIN_SIZE)
      let tileIndex = 0
      for (let localZ = -TERRAIN_TILE_RADIUS; localZ <= TERRAIN_TILE_RADIUS; localZ += 1) {
        for (let localX = -TERRAIN_TILE_RADIUS; localX <= TERRAIN_TILE_RADIUS; localX += 1) {
          const tile = terrainTiles[tileIndex]
          tile.position.x = (centerTileX + localX) * TERRAIN_SIZE
          tile.position.z = (centerTileZ + localZ) * TERRAIN_SIZE
          tileIndex += 1
        }
      }

      // Move decorative meadow details with terrain tiling so they feel infinite too.
      const decorAnchorX = centerTileX * TERRAIN_SIZE
      const decorAnchorZ = centerTileZ * TERRAIN_SIZE
      flowersGroup.position.set(decorAnchorX, 0, decorAnchorZ)
      grassGroup.position.set(decorAnchorX, 0, decorAnchorZ)
      flowersPackGroup.position.set(decorAnchorX, 0, decorAnchorZ)
      mushroomsGroup.position.set(decorAnchorX, 0, decorAnchorZ)
      natureGroup.position.set(decorAnchorX, 0, decorAnchorZ)

      // Keep camera above terrain so users can't go below mountains.
      const groundY = sampleTerrainHeightAtWorld(heightData, camera.position.x, camera.position.z)
      const minCameraY = groundY + CAMERA_GROUND_CLEARANCE
      if (camera.position.y < minCameraY) {
        camera.position.y = minCameraY
      }

      // Wider FOV during intro amplifies speed sensation.
      const desiredFov = isAutopilotActive ? 76 : targetFov
      camera.fov += (desiredFov - camera.fov) * 0.14
      camera.updateProjectionMatrix()

      updateCameraLook()

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", onResize)
    render()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onResize)
      renderer.domElement.removeEventListener("pointermove", onPointerMove)
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("pointerup", onPointerUp)
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      renderer.domElement.removeEventListener("wheel", onWheel)
      if (heroHideTimeout !== null) window.clearTimeout(heroHideTimeout)
      geometry.dispose()
      material.dispose()
      desertTexture.dispose()
      meadowTexture.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      particleSpriteTexture.dispose()
      sunTexture.dispose()
      sunCoreMaterial.dispose()
      sunHaloMaterial.dispose()
      bgm.pause()
      bgm.src = ""
      bgmRef.current = null
      startBgmFnRef.current = () => {}
      bgmStartedRef.current = false
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <main
      ref={mountRef}
      className="relative h-screen w-screen overflow-hidden touch-manipulation"
      onClick={() => {
        if (!needsAudioStart) return
        startBgmFnRef.current()
        setNeedsAudioStart(false)
        startIntroRef.current = true
      }}
    >
      {needsAudioStart && (
        <div
          className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_center,rgba(22,26,35,0.42)_0%,rgba(12,15,20,0.82)_72%,rgba(8,10,14,0.95)_100%)]"
          aria-hidden
        />
      )}
      <div
        ref={introFireflyRef}
        className={`pointer-events-none absolute left-1/2 z-30 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff1a6] shadow-[0_0_18px_10px_rgba(255,223,132,0.55),0_0_42px_22px_rgba(255,198,102,0.25)] transition-all duration-500 ${
          needsAudioStart ? "top-[calc(38%-24px)]" : "top-1/2"
        }`}
      />
      {showHero && (
        <div
          className={`pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center text-white transition-opacity duration-700 ${
            heroExiting ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            <p
              className={`text-xs uppercase tracking-[0.28em] text-white/70 transition-all duration-700 ${
                introTextVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: "80ms" }}
            >
              Welcome to
            </p>
            <h1
              className={`mt-4 text-5xl font-semibold tracking-wide md:text-7xl transition-all duration-700 ${
                introTextVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "220ms" }}
            >
              Entropy II
            </h1>
            <p
              className={`mt-4 px-4 text-sm text-white/82 md:text-base transition-all duration-700 ${
                introTextVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "380ms" }}
            >
              {needsAudioStart
                ? "Tap anywhere to start"
                : "Tap to begin your flight"}
            </p>
          </div>
        </div>
      )}
      {showControlsHint && (
        <>
          {/* Dark overlay: dims the scene and captures click to dismiss */}
          <button
            type="button"
            className="absolute inset-0 z-30 cursor-default bg-black/50"
            onClick={() => {
              if (arrowHintTimeoutRef.current) window.clearTimeout(arrowHintTimeoutRef.current)
              arrowHintTimeoutRef.current = null
              setShowControlsHint(false)
            }}
            aria-label="Dismiss controls hint"
          />
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center text-white">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/65">You have control</p>
              <p className="mt-4 text-sm text-white/90 md:text-base">
                Drag to steer and move. Scroll or pinch to zoom.
              </p>
            </div>
          </div>
        </>
      )}
      <div
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-2xl bg-black/20 px-1 py-1.5 backdrop-blur-sm sm:right-5 sm:px-2 sm:py-2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-0.5 sm:gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setSceneMode("meadow")
            }}
            className={`min-h-[44px] min-w-[44px] touch-manipulation p-3 transition sm:p-2 ${
              sceneMode === "meadow" ? "text-white" : "text-white/55 hover:text-white/85 active:text-white/90"
            }`}
            aria-label="Switch to meadow scene"
            title="Meadow"
          >
            <svg className="h-5 w-5 sm:h-[22px] sm:w-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 2.8V5.2M12 18.8V21.2M21.2 12H18.8M5.2 12H2.8M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5M18.5 18.5L16.8 16.8M7.2 7.2L5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="my-0.5 h-px w-9 bg-white/40" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setSceneMode("desert")
            }}
            className={`min-h-[44px] min-w-[44px] touch-manipulation p-3 transition sm:p-2 ${
              sceneMode === "desert" ? "text-white" : "text-white/55 hover:text-white/85 active:text-white/90"
            }`}
            aria-label="Switch to desert scene"
            title="Desert"
          >
            <svg className="h-5 w-5 sm:h-[22px] sm:w-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3.5 18.5L9.2 11.6L12.8 15.8L16.3 12.3L20.5 18.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <Link
        href="/"
        className="absolute left-2 z-20 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center text-white/95 transition hover:text-white active:text-white sm:left-4"
        style={{ top: "max(0.5rem, env(safe-area-inset-top, 0px))" }}
        aria-label="Back to home"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition sm:h-10 sm:w-10">
          <svg className="h-5 w-5 sm:h-[22px] sm:w-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          toggleAudio()
        }}
        className="absolute right-2 z-20 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center text-white/95 transition hover:text-white active:text-white sm:right-4"
        style={{ top: "max(0.5rem, env(safe-area-inset-top, 0px))" }}
        aria-label={isMuted ? "Turn background music on" : "Turn background music off"}
        title={isMuted ? "Music off" : "Music on"}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition sm:h-10 sm:w-10">
        {isMuted ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M11 5L6.8 8.6H4.5C3.95 8.6 3.5 9.05 3.5 9.6V14.4C3.5 14.95 3.95 15.4 4.5 15.4H6.8L11 19V5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M15 9L20 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20 9L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M11 5L6.8 8.6H4.5C3.95 8.6 3.5 9.05 3.5 9.6V14.4C3.5 14.95 3.95 15.4 4.5 15.4H6.8L11 19V5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M15.3 9.2C16.2 10 16.8 11.2 16.8 12.5C16.8 13.8 16.2 15 15.3 15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M17.8 7.2C19.2 8.5 20 10.4 20 12.5C20 14.6 19.2 16.5 17.8 17.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        </span>
      </button>
    </main>
  )
}
