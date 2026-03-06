"use client"

/**
 * Lightweight 3D preview of the Entropy II world for portfolio.
 * Bright day; one continuous cinematic sweep—camera arcs across the landscape, then loops.
 */

const CINEMATIC_SPEED = 130
const FLY_PATH_LENGTH = 14000
const START_Z = 4000
const BASE_CAMERA_Y = 2850
const SWEEP_AMPLITUDE_X = 380
const VERTICAL_WAVE_AMPLITUDE = 140
const TILE_Z_SPAN = 2550
const NUM_TILES = 5
const FIREFLY_COUNT = 70

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const PREVIEW_WORLD_SIZE = 128
const PREVIEW_TERRAIN_SIZE = 3200
const PREVIEW_HEIGHT_SCALE = 10

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
  for (let z = 0; z < depth; z += 1) data[z * width + (width - 1)] = data[z * width]
  for (let x = 0; x < width; x += 1) data[(depth - 1) * width + x] = data[x]
  data[(depth - 1) * width + (width - 1)] = data[0]
  return data
}

function generateMeadowTexture(data: Uint8Array, width: number, height: number) {
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
  const sun = new THREE.Vector3(0.85, 1.15, 0.35).normalize()
  for (let i = 0, j = 0; i < imageData.length; i += 4, j += 1) {
    normal.x = (data[j - 2] ?? data[j]) - (data[j + 2] ?? data[j])
    normal.y = 2
    normal.z = (data[j - width * 2] ?? data[j]) - (data[j + width * 2] ?? data[j])
    normal.normalize()
    const shade = normal.dot(sun)
    const elevation = 0.5 + data[j] * 0.007
    // Match actual project meadow: olive/sage greens.
    imageData[i] = (92 + shade * 70) * elevation
    imageData[i + 1] = (128 + shade * 98) * elevation
    imageData[i + 2] = (92 + shade * 62) * elevation
    imageData[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
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

function createCircleSpriteTexture(size = 32) {
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

function createSunGlowTexture(size = 128) {
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

interface EntropyIIPreviewProps {
  width: number
  height: number
  mouseX?: number
  mouseY?: number
}

export function EntropyIIPreview({ width, height }: EntropyIIPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || width < 1 || height < 1) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xdcf1ff)
    scene.fog = new THREE.FogExp2(0xeaf7ff, 0.0003)

    const camera = new THREE.PerspectiveCamera(58, width / height, 8, 16000)
    const startTime = performance.now()
    const lookAhead = new THREE.Vector3()
    const updateCamera = () => {
      const t = (performance.now() - startTime) / 1000
      const dist = (t * CINEMATIC_SPEED) % FLY_PATH_LENGTH
      const phase = (dist / FLY_PATH_LENGTH) * Math.PI * 2
      camera.position.x = SWEEP_AMPLITUDE_X * Math.sin(phase)
      camera.position.y = BASE_CAMERA_Y + VERTICAL_WAVE_AMPLITUDE * Math.sin(phase * 1.4)
      camera.position.z = START_Z - dist
      lookAhead.set(
        camera.position.x + SWEEP_AMPLITUDE_X * 0.15 * Math.cos(phase),
        camera.position.y - 220,
        camera.position.z - 520
      )
      camera.lookAt(lookAhead)
      camera.updateProjectionMatrix()
    }
    updateCamera()

    const ambientLight = new THREE.HemisphereLight(0xf6fbff, 0x93b48a, 0.92)
    scene.add(ambientLight)
    const sunLight = new THREE.DirectionalLight(0xfff6de, 1.08)
    sunLight.position.set(800, 1200, 600)
    scene.add(sunLight)

    const sunTexture = new THREE.CanvasTexture(createSunGlowTexture())
    sunTexture.colorSpace = THREE.SRGBColorSpace
    const sunMaterial = new THREE.SpriteMaterial({
      map: sunTexture,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      depthTest: false,
    })
    const sunSprite = new THREE.Sprite(sunMaterial)
    sunSprite.scale.setScalar(420)
    scene.add(sunSprite)

    const particlePositions = new Float32Array(FIREFLY_COUNT * 3)
    const particleBase = new Float32Array(FIREFLY_COUNT * 3)
    const particleColors = new Float32Array(FIREFLY_COUNT * 3)
    const particlePhase = new Float32Array(FIREFLY_COUNT)
    const particleSpeed = new Float32Array(FIREFLY_COUNT)
    const random = makeSeededRandom(99)
    for (let i = 0; i < FIREFLY_COUNT; i += 1) {
      const idx = i * 3
      particleBase[idx] = (random() - 0.5) * 280
      particleBase[idx + 1] = (random() - 0.5) * 200
      particleBase[idx + 2] = (random() - 0.5) * 280
      particlePositions[idx] = particleBase[idx]
      particlePositions[idx + 1] = particleBase[idx + 1]
      particlePositions[idx + 2] = particleBase[idx + 2]
      particlePhase[i] = random() * Math.PI * 2
      particleSpeed[i] = 0.5 + random() * 0.8
      const warmth = random()
      particleColors[idx] = 1
      particleColors[idx + 1] = 0.82 + warmth * 0.17
      particleColors[idx + 2] = 0.5 + warmth * 0.3
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))
    const particleSpriteTexture = new THREE.CanvasTexture(createCircleSpriteTexture())
    particleSpriteTexture.colorSpace = THREE.SRGBColorSpace
    const particleMaterial = new THREE.PointsMaterial({
      map: particleSpriteTexture,
      size: 5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.42,
      vertexColors: true,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const heightData = generateHeight(PREVIEW_WORLD_SIZE, PREVIEW_WORLD_SIZE)
    const geometry = new THREE.PlaneGeometry(
      PREVIEW_TERRAIN_SIZE,
      PREVIEW_TERRAIN_SIZE,
      PREVIEW_WORLD_SIZE - 1,
      PREVIEW_WORLD_SIZE - 1
    )
    geometry.rotateX(-Math.PI / 2)
    const vertices = geometry.attributes.position.array as Float32Array
    for (let i = 0, j = 0; i < heightData.length; i += 1, j += 3) {
      vertices[j + 1] = heightData[i] * PREVIEW_HEIGHT_SCALE
    }
    geometry.computeVertexNormals()

    const texture = new THREE.CanvasTexture(
      generateMeadowTexture(heightData, PREVIEW_WORLD_SIZE, PREVIEW_WORLD_SIZE)
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({ map: texture })
    const tileGroups: THREE.Group[] = []
    const spread = PREVIEW_TERRAIN_SIZE * 0.45
    for (let i = 0; i < NUM_TILES; i += 1) {
      const group = new THREE.Group()
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      const decorGroup = new THREE.Group()
      group.add(decorGroup)
      scene.add(group)
      tileGroups.push(group)
    }

    const loader = new GLTFLoader()
    const scatterOnTiles = (
      url: string,
      countPerTile: number,
      targetHeight: number,
      yOffset: number
    ) => {
      loader.load(
        url,
        (gltf) => {
          const prototype = gltf.scene
          prototype.updateMatrixWorld(true)
          const box = new THREE.Box3().setFromObject(prototype)
          const modelHeight = Math.max(0.001, box.max.y - box.min.y)
          const baseScale = targetHeight / modelHeight
          for (let t = 0; t < NUM_TILES; t += 1) {
            const decorGroup = tileGroups[t].children[1] as THREE.Group
            for (let i = 0; i < countPerTile; i += 1) {
              const obj = prototype.clone(true)
              const x = (makeSeededRandom(t * 1000 + i)() - 0.5) * spread * 2
              const z = (makeSeededRandom(t * 1000 + i + 500)() - 0.5) * spread * 2
              obj.position.set(x, yOffset, z)
              obj.scale.setScalar(baseScale * (0.7 + makeSeededRandom(t * 1000 + i + 999)() * 0.6))
              obj.rotation.y = makeSeededRandom(t * 1000 + i + 333)() * Math.PI * 2
              decorGroup.add(obj)
            }
          }
        },
        undefined,
        () => {}
      )
    }
    scatterOnTiles("/models/low_poly_nature_pack.glb", 10, 280, 8)
    scatterOnTiles("/models/low_poly_flower.glb", 6, 18, 6)
    scatterOnTiles("/models/low_poly_grass_pack.glb", 5, 20, 5)
    scatterOnTiles("/models/low_poly_mushrooms_amanita_muscaria.glb", 3, 16, 4)

    let frameId = 0
    let particleTime = 0
    const render = () => {
      const delta = 0.016
      particleTime += delta
      updateCamera()
      const camZ = camera.position.z
      const baseTileZ = Math.floor(camZ / TILE_Z_SPAN) * TILE_Z_SPAN
      for (let i = 0; i < NUM_TILES; i += 1) {
        const tileZ = baseTileZ + (i - Math.floor(NUM_TILES / 2)) * TILE_Z_SPAN
        tileGroups[i].position.set(0, 0, tileZ)
      }
      particles.position.copy(camera.position)
      particles.position.y += 30
      const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute
      const colAttr = particleGeometry.getAttribute("color") as THREE.BufferAttribute
      const posArr = posAttr.array as Float32Array
      const colArr = colAttr.array as Float32Array
      for (let i = 0; i < FIREFLY_COUNT; i += 1) {
        const idx = i * 3
        particlePhase[i] += delta * particleSpeed[i]
        const p = particlePhase[i]
        const dx = Math.sin(p) * 14 + Math.cos(p * 0.7) * 9
        const dy = Math.cos(p * 1.1) * 11
        const dz = Math.sin(p * 0.9) * 11
        posArr[idx] = particleBase[idx] + dx
        posArr[idx + 1] = particleBase[idx + 1] + dy
        posArr[idx + 2] = particleBase[idx + 2] + dz
        const twinkle = 0.6 + 0.4 * Math.sin(p * 2 + i * 0.3)
        colArr[idx] = particleColors[idx] * twinkle
        colArr[idx + 1] = particleColors[idx + 1] * twinkle
        colArr[idx + 2] = particleColors[idx + 2] * twinkle
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
      sunSprite.position.set(
        camera.position.x + 400,
        camera.position.y + 380,
        camera.position.z - 600
      )
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(render)
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    render()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
      sunTexture.dispose()
      sunMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      particleSpriteTexture.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [width, height])

  if (width < 1 || height < 1) return null
  return (
    <div
      ref={mountRef}
      className="overflow-hidden rounded-[inherit] bg-[#dcf1ff]"
      style={{ width, height }}
    />
  )
}
