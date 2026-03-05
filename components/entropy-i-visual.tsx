"use client"

/**
 * Entropy I — 3D particle shape that reacts to the Half Light of Dawn MP3.
 * Spin, morph (sphere ↔ cube), size and breath are driven by the song.
 * Hold mouse to scatter; scroll to zoom.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Volume2, VolumeX, ArrowLeft } from "lucide-react"

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)")
    setIsTouch(mq.matches)
    const update = () => setIsTouch(mq.matches)
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isTouch
}

const AUDIO_SRC = "/audio/half-light-of-dawn.mp3"

interface Particle {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
  targetX: number
  targetY: number
  targetZ: number
  size: number
  opacity: number
  angle: number
  pulseOffset: number
  noiseOffsetX: number
  noiseOffsetY: number
  velocityX: number
  velocityY: number
  velocityZ: number
}

interface Ripple {
  x: number
  y: number
  z: number
  radius: number
  maxRadius: number
  strength: number
  type: "push" | "pull" | "spin"
}

function generateSphere(numParticles: number, radius: number) {
  const positions: Array<{ x: number; y: number; z: number }> = []
  for (let i = 0; i < numParticles; i++) {
    const phi = Math.acos(-1 + (2 * i) / numParticles)
    const theta = Math.sqrt(numParticles * Math.PI) * phi
    positions.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    })
  }
  return positions
}

function generateCube(numParticles: number, size: number) {
  const positions: Array<{ x: number; y: number; z: number }> = []
  const particlesPerFace = Math.floor(numParticles / 6)
  const half = size / 2
  // Square grid per face so the cube is geometrically perfect (u,v span [-half, half])
  const gridCols = Math.max(1, Math.ceil(Math.sqrt(particlesPerFace)))
  const gridRows = Math.max(1, Math.floor(particlesPerFace / gridCols))
  const uDenom = gridCols > 1 ? gridCols - 1 : 1
  const vDenom = gridRows > 1 ? gridRows - 1 : 1
  for (let i = 0; i < numParticles; i++) {
    const face = Math.min(5, Math.floor(i / particlesPerFace))
    const idx = i % particlesPerFace
    const row = Math.floor(idx / gridCols)
    const col = idx % gridCols
    const u = (col / uDenom - 0.5) * size
    const v = (Math.min(row, gridRows - 1) / vDenom - 0.5) * size
    let x = 0,
      y = 0,
      z = 0
    switch (face) {
      case 0:
        x = half
        y = u
        z = v
        break
      case 1:
        x = -half
        y = u
        z = v
        break
      case 2:
        x = u
        y = half
        z = v
        break
      case 3:
        x = u
        y = -half
        z = v
        break
      case 4:
        x = u
        y = v
        z = half
        break
      case 5:
        x = u
        y = v
        z = -half
        break
    }
    positions.push({ x, y, z })
  }
  return positions
}

export function EntropyIVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const ripplesRef = useRef<Ripple[]>([])
  const mouseDownRef = useRef(false)
  const zoomRef = useRef(1)
  const rotationSpeedRef = useRef(0.0004)
  const isScatteredRef = useRef(false)
  const scatterTimeRef = useRef(0)
  const smoothMorphRef = useRef(0)
  const morphTargetRef = useRef(0) // 0 = sphere, 1 = cube — morph from loudness, tone shift, or Space
  const manualMorphUntilRef = useRef(0) // after Space/Morph, ignore audio morph briefly
  const levelBaselineRef = useRef(0) // slow average for tone-shift detection
  const lastToneShiftAtRef = useRef(0)
  const audioStartedAtRef = useRef(0) // when audio analysis started (for "morph within 5s" guarantee)
  const lastTimeBecameSphereRef = useRef(0)
  const lastTimeBecameCubeRef = useRef(0)
  const spherePositionsRef = useRef<Array<{ x: number; y: number; z: number }>>([])
  const cubePositionsRef = useRef<Array<{ x: number; y: number; z: number }>>([])

  // Audio: refs for context, analyser, and smoothed values
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const smoothLevelRef = useRef(0)
  const smoothBassRef = useRef(0)
  const [audioReady, setAudioReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const isTouch = useIsTouch()
  const touchScatterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scatterParticles = () => {
    // Keep cube perfectly rigid: disable scatter distortions while cube is active.
    if (morphTargetRef.current > 0.5) {
      isScatteredRef.current = false
      scatterTimeRef.current = 0
      return
    }
    isScatteredRef.current = true
    scatterTimeRef.current = 0
  }
  const gatherParticles = () => {
    isScatteredRef.current = false
    scatterTimeRef.current = 0
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      const newX = (e.clientX / window.innerWidth - 0.5) * 2
      const newY = (e.clientY / window.innerHeight - 0.5) * 2
      const vx = Math.abs(newX - mouseRef.current.x)
      const vy = Math.abs(newY - mouseRef.current.y)
      rotationSpeedRef.current = 0.0004 + Math.sqrt(vx * vx + vy * vy) * 0.006
      mouseRef.current.x = newX
      mouseRef.current.y = newY
      if (mouseDownRef.current && isScatteredRef.current) scatterTimeRef.current += 0.05
    }
    const handleMouseDown = () => {
      mouseDownRef.current = true
      scatterParticles()
    }
    const handleMouseUp = () => {
      mouseDownRef.current = false
      gatherParticles()
    }
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomRef.current = Math.max(0.3, Math.min(2.5, zoomRef.current - e.deltaY * 0.001))
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]
        mouseRef.current.x = (t.clientX / window.innerWidth - 0.5) * 2
        mouseRef.current.y = (t.clientY / window.innerHeight - 0.5) * 2
      }
      touchScatterTimerRef.current = setTimeout(() => {
        mouseDownRef.current = true
        scatterParticles()
        touchScatterTimerRef.current = null
      }, 400)
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        const t = e.touches[0]
        const newX = (t.clientX / window.innerWidth - 0.5) * 2
        const newY = (t.clientY / window.innerHeight - 0.5) * 2
        mouseRef.current.x = newX
        mouseRef.current.y = newY
        if (mouseDownRef.current && isScatteredRef.current) scatterTimeRef.current += 0.05
      }
    }
    const handleTouchEnd = () => {
      if (touchScatterTimerRef.current) {
        clearTimeout(touchScatterTimerRef.current)
        touchScatterTimerRef.current = null
      }
      mouseDownRef.current = false
      gatherParticles()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    // Initialize particles (Fibonacci sphere)
    if (particlesRef.current.length === 0) {
      const radius = 200
      const numParticles = 1800
      const particles: Particle[] = []
      for (let i = 0; i < numParticles; i++) {
        const phi = Math.acos(-1 + (2 * i) / numParticles)
        const theta = Math.sqrt(numParticles * Math.PI) * phi
        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)
        particles.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          targetX: x,
          targetY: y,
          targetZ: z,
          size: 1 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7,
          angle: Math.random() * Math.PI * 2,
          pulseOffset: Math.random() * Math.PI * 2,
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000,
          velocityX: 0,
          velocityY: 0,
          velocityZ: 0,
        })
      }
      particlesRef.current = particles
      const n = particles.length
      const sphereRadius = 200
      spherePositionsRef.current = generateSphere(n, sphereRadius)
      // Cube inscribed in same sphere so corners don’t spike out (half-size = r/√3)
      const cubeSize = (sphereRadius * 2) / Math.sqrt(3)
      cubePositionsRef.current = generateCube(n, cubeSize)
    }

    const noise = (x: number, y: number) =>
      Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const particles = particlesRef.current

      timeRef.current += 0.01

      // Audio-driven values: breath, expansion, spin, and morph. Before start: same as preview (full-size sphere, gentle breath, mouse rotation).
      let breathFromAudio = 1
      let expansionFromAudio = 1
      if (!analyserRef.current) {
        expansionFromAudio = 1
        breathFromAudio = Math.sin(timeRef.current * 0.5) * 0.06 + 1
      }
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        const bass = (data[0] + data[1] + data[2] + data[3] + data[4]) / 5 / 255
        const overall =
          data.reduce((a, b) => a + b, 0) / data.length / 255
        const smooth = 0.06
        smoothBassRef.current += (bass - smoothBassRef.current) * smooth
        smoothLevelRef.current += (overall - smoothLevelRef.current) * smooth
        breathFromAudio = 0.35 + smoothBassRef.current * 1.55
        expansionFromAudio = 0.2 + smoothLevelRef.current * 1.95
        // Spin: very slow to avoid dizziness
        rotationSpeedRef.current =
          0.0002 + smoothLevelRef.current * 0.002 + rotationSpeedRef.current * 0.96
        // Morph: tone shift is primary (morph on big or medium shift); loudness can also trigger
        const level = smoothLevelRef.current
        const now = typeof performance !== "undefined" ? performance.now() : 0
        if (audioStartedAtRef.current === 0) audioStartedAtRef.current = now
        const elapsed = now - audioStartedAtRef.current
        levelBaselineRef.current += (level - levelBaselineRef.current) * 0.012
        const baseline = levelBaselineRef.current
        const toneShift = level - baseline
        const minDwellMs = 7000
        const canLeaveSphere =
          lastTimeBecameSphereRef.current === 0 ||
          now >= lastTimeBecameSphereRef.current + minDwellMs
        const canLeaveCube =
          lastTimeBecameCubeRef.current === 0 ||
          now >= lastTimeBecameCubeRef.current + minDwellMs
        const baseCanTrigger =
          now > manualMorphUntilRef.current &&
          ((morphTargetRef.current > 0.5 && canLeaveCube) ||
            (morphTargetRef.current < 0.5 && canLeaveSphere))
        const dwellElapsed = lastToneShiftAtRef.current === 0 ? 9999 : now - lastToneShiftAtRef.current
        const canTriggerAgain = dwellElapsed >= minDwellMs
        const bigToneShift = toneShift > 0.14 || toneShift < -0.12
        const loudness = level > 0.38
        const canTriggerFromToneShift = baseCanTrigger && canTriggerAgain
        const canTriggerFromLoudness = baseCanTrigger && canTriggerAgain
        if (canTriggerFromToneShift && bigToneShift) {
          morphTargetRef.current = morphTargetRef.current > 0.5 ? 0 : 1
          lastToneShiftAtRef.current = now
          if (morphTargetRef.current < 0.5) lastTimeBecameSphereRef.current = now
          else lastTimeBecameCubeRef.current = now
        } else if (canTriggerFromLoudness && loudness) {
          morphTargetRef.current = morphTargetRef.current > 0.5 ? 0 : 1
          lastToneShiftAtRef.current = now
          if (morphTargetRef.current < 0.5) lastTimeBecameSphereRef.current = now
          else lastTimeBecameCubeRef.current = now
        }
        if (
          now > manualMorphUntilRef.current &&
          elapsed > 3500 &&
          elapsed < 5500 &&
          morphTargetRef.current < 0.5 &&
          smoothMorphRef.current < 0.25 &&
          canLeaveSphere &&
          canTriggerAgain
        ) {
          morphTargetRef.current = 1
          lastToneShiftAtRef.current = now
          lastTimeBecameCubeRef.current = now
        }
        const d = morphTargetRef.current - smoothMorphRef.current
        const morphSpeedToCube = 0.11
        const morphSpeedToSphere = 0.095
        const easeIn = 0.75
        if (d > 0) {
          const step = morphSpeedToCube * (1 + easeIn * d)
          smoothMorphRef.current = Math.min(morphTargetRef.current, smoothMorphRef.current + step)
        } else if (d < 0) {
          const step = morphSpeedToSphere * (1 + easeIn * -d)
          smoothMorphRef.current = Math.max(morphTargetRef.current, smoothMorphRef.current - step)
        }
      } else {
        rotationSpeedRef.current = rotationSpeedRef.current * 0.96
      }

      rotationRef.current += rotationSpeedRef.current
      const mouseRotationY = mouseRef.current.x * Math.PI

      // Apply audio-driven morph to particle targets (sphere ↔ cube)
      const spherePos = spherePositionsRef.current
      const cubePos = cubePositionsRef.current
      const blend = smoothMorphRef.current
      const rigidCube = morphTargetRef.current > 0.5 && !isScatteredRef.current
      const blendForTarget = rigidCube ? 1 : blend
      if (spherePos.length === particles.length && cubePos.length === particles.length) {
        particles.forEach((p, i) => {
          p.targetX = spherePos[i].x * (1 - blendForTarget) + cubePos[i].x * blendForTarget
          p.targetY = spherePos[i].y * (1 - blendForTarget) + cubePos[i].y * blendForTarget
          p.targetZ = spherePos[i].z * (1 - blendForTarget) + cubePos[i].z * blendForTarget
        })
      }

      const expansionFactor =
        (1.0 + (mouseRef.current.y + 1) * 0.3) * zoomRef.current * expansionFromAudio
      const breathPulse =
        (Math.sin(timeRef.current * 0.5) * 0.08 + 1) * breathFromAudio

      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += 5
        return r.radius < r.maxRadius
      })

      particles.forEach((particle) => {
        if (isScatteredRef.current) {
          // Push away from center of the orb/cube (0, 0, 0) — all at once
          const dx = particle.x
          const dy = particle.y
          const dz = particle.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (distance > 1) {
            const scatterForce = (1 + scatterTimeRef.current * 0.5) * 2
            particle.velocityX += (dx / distance) * scatterForce
            particle.velocityY += (dy / distance) * scatterForce
            particle.velocityZ += (dz / distance) * scatterForce
          } else {
            const angle1 = Math.random() * Math.PI * 2
            const angle2 = Math.random() * Math.PI * 2
            const force = 3
            particle.velocityX += Math.cos(angle1) * Math.sin(angle2) * force
            particle.velocityY += Math.sin(angle1) * Math.sin(angle2) * force
            particle.velocityZ += Math.cos(angle2) * force
          }
        }

        if (!rigidCube) {
          ripplesRef.current.forEach((ripple) => {
            const dx = particle.baseX - ripple.x
            const dy = particle.baseY - ripple.y
            const dz = particle.baseZ - ripple.z
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if (distance < ripple.radius && distance > ripple.radius - 50) {
              const force =
                (1 - (ripple.radius - distance) / 50) * ripple.strength
              if (ripple.type === "push") {
                particle.velocityX += (dx / distance) * force * 0.05
                particle.velocityY += (dy / distance) * force * 0.05
                particle.velocityZ += (dz / distance) * force * 0.05
              } else if (ripple.type === "pull") {
                particle.velocityX -= (dx / distance) * force * 0.05
                particle.velocityY -= (dy / distance) * force * 0.05
                particle.velocityZ -= (dz / distance) * force * 0.05
              } else if (ripple.type === "spin") {
                particle.velocityX += (dz / distance) * force * 0.05
                particle.velocityZ -= (dx / distance) * force * 0.05
                particle.velocityY += Math.sin(distance * 0.1) * force * 0.03
              }
            }
          })
        }

        const inMorph = Math.abs(morphTargetRef.current - smoothMorphRef.current) > 0.002
        const morphSpeed = rigidCube ? 1 : (isScatteredRef.current ? 0.01 : (inMorph ? 0.09 : 0.05))
        particle.baseX += (particle.targetX - particle.baseX) * morphSpeed
        particle.baseY += (particle.targetY - particle.baseY) * morphSpeed
        particle.baseZ += (particle.targetZ - particle.baseZ) * morphSpeed

        if (isScatteredRef.current) {
          particle.velocityX += (particle.baseX - particle.x) * 0.001
          particle.velocityY += (particle.baseY - particle.y) * 0.001
          particle.velocityZ += (particle.baseZ - particle.z) * 0.001
          particle.velocityX *= 0.85
          particle.velocityY *= 0.85
          particle.velocityZ *= 0.85
          particle.x += particle.velocityX
          particle.y += particle.velocityY
          particle.z += particle.velocityZ
        } else if (rigidCube) {
          particle.velocityX = 0
          particle.velocityY = 0
          particle.velocityZ = 0
          particle.x = particle.baseX
          particle.y = particle.baseY
          particle.z = particle.baseZ
        } else {
          particle.velocityX = 0
          particle.velocityY = 0
          particle.velocityZ = 0
          const gatherSpeed = 0.3
          particle.x += (particle.baseX - particle.x) * gatherSpeed
          particle.y += (particle.baseY - particle.y) * gatherSpeed
          particle.z += (particle.baseZ - particle.z) * gatherSpeed
        }
      })

      const isCube = rigidCube || blend > 0.88
      const noiseScale = isCube ? 0 : 1 - blend
      const breathScale = isCube ? 1 : breathPulse

      const projected = particles.map((particle) => {
        const noiseX = noise(particle.noiseOffsetX + timeRef.current, timeRef.current) * 15 * noiseScale
        const noiseY = noise(particle.noiseOffsetY + timeRef.current, timeRef.current * 0.8) * 15 * noiseScale
        const noiseZ =
          noise(timeRef.current, particle.noiseOffsetX + particle.noiseOffsetY) * 15 * noiseScale
        const particlePulse =
          isCube ? 1 : Math.sin(timeRef.current * 2 + particle.pulseOffset) * 0.05 + 1
        let x =
          particle.x * expansionFactor * breathScale * particlePulse + noiseX
        let y =
          particle.y * expansionFactor * breathScale * particlePulse + noiseY
        let z =
          particle.z * expansionFactor * breathScale * particlePulse + noiseZ

        const cosY = Math.cos(rotationRef.current)
        const sinY = Math.sin(rotationRef.current)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        const cosMouseY = Math.cos(mouseRotationY)
        const sinMouseY = Math.sin(mouseRotationY)
        const x2 = x1 * cosMouseY - z1 * sinMouseY
        const z2 = x1 * sinMouseY + z1 * cosMouseY
        const mouseRotationX = mouseRef.current.y * Math.PI * 0.5 + mouseRef.current.x * 0.1
        const cosMouseX = Math.cos(mouseRotationX)
        const sinMouseX = Math.sin(mouseRotationX)
        const y2 = y * cosMouseX - z2 * sinMouseX
        const z3 = y * sinMouseX + z2 * cosMouseX
        const perspective = 800
        const scale = rigidCube ? 1 : perspective / (perspective + z3)
        return {
          particle,
          screenX: centerX + x2 * scale,
          screenY: centerY + y2 * scale,
          scale,
          depth: z3,
          x: x2,
          y: y2,
          z: z3,
        }
      })

      projected.sort((a, b) => a.depth - b.depth)
      const clickVisualBoost = rigidCube && mouseDownRef.current ? 1.35 : 1

      for (let i = 0; i < projected.length; i += 3) {
        for (let j = i + 1; j < Math.min(i + 8, projected.length); j++) {
          const dx = projected[i].x - projected[j].x
          const dy = projected[i].y - projected[j].y
          const dz = projected[i].z - projected[j].z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (distance < 50 * expansionFactor) {
            const lineOpacity = Math.max(
              0,
              0.15 - distance / (300 * expansionFactor)
            ) * clickVisualBoost
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`
            ctx.lineWidth = 0.5 * clickVisualBoost
            ctx.beginPath()
            ctx.moveTo(projected[i].screenX, projected[i].screenY)
            ctx.lineTo(projected[j].screenX, projected[j].screenY)
            ctx.stroke()
          }
        }
      }

      const audioPulse = analyserRef.current
        ? 1 + smoothLevelRef.current * 0.5
        : 1
      projected.forEach((p) => {
        const lineLength =
          (8 + Math.sin(timeRef.current * 3 + p.particle.pulseOffset) * 4) *
          p.scale *
          audioPulse *
          clickVisualBoost
        const opacity = p.particle.opacity * Math.max(0.2, p.scale)
        const lineAngle = p.particle.angle + timeRef.current * 0.5
        const dx = Math.cos(lineAngle) * lineLength
        const dy = Math.sin(lineAngle) * lineLength
        const startX = p.screenX - dx / 2
        const startY = p.screenY - dy / 2
        const endX = p.screenX + dx / 2
        const endY = p.screenY + dy / 2
        const lightIntensity = Math.max(
          0.2,
          (p.z + 400 * expansionFactor) / (800 * expansionFactor)
        )
        const pulseOpacity =
          Math.sin(timeRef.current * 2 + p.particle.pulseOffset) * 0.3 + 0.7
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * lightIntensity * pulseOpacity})`
        ctx.lineWidth = (1 + p.particle.size * 0.3) * p.scale * clickVisualBoost
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        if (p.depth > 50 && p.particle.opacity > 0.6) {
          const glowSize =
            10 + Math.sin(timeRef.current * 3 + p.particle.pulseOffset) * 5
          ctx.shadowBlur = glowSize * clickVisualBoost
          ctx.shadowColor = "rgba(255, 255, 255, 0.6)"
          ctx.lineWidth = (2 + p.particle.size * 0.5) * p.scale * clickVisualBoost
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchcancel", handleTouchEnd)
      if (touchScatterTimerRef.current) clearTimeout(touchScatterTimerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  // Set up audio on first user interaction (required by browsers)
  const setupAudio = async () => {
    if (audioReady) return
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audioRef.current = audio

    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    audioContextRef.current = ctx
    if (ctx.state === "suspended") await ctx.resume()
    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.7
    source.connect(analyser)
    analyser.connect(ctx.destination)
    analyserRef.current = analyser

    await audio.play().catch(() => {})
    setAudioReady(true)
  }

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    if (isPaused) {
      audioRef.current.play()
      setIsPaused(false)
    } else {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (audioReady) {
        const now = typeof performance !== "undefined" ? performance.now() : 0
        morphTargetRef.current = smoothMorphRef.current > 0.5 ? 0 : 1
        manualMorphUntilRef.current = now + 5500
        lastToneShiftAtRef.current = now
        if (morphTargetRef.current < 0.5) lastTimeBecameSphereRef.current = now
        else lastTimeBecameCubeRef.current = now
      } else {
        setupAudio()
      }
    }
  }

  const handleMorphTap = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioReady) {
      const now = typeof performance !== "undefined" ? performance.now() : 0
      morphTargetRef.current = smoothMorphRef.current > 0.5 ? 0 : 1
      manualMorphUntilRef.current = now + 5500
      lastToneShiftAtRef.current = now
      if (morphTargetRef.current < 0.5) lastTimeBecameSphereRef.current = now
      else lastTimeBecameCubeRef.current = now
    }
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black cursor-crosshair outline-none focus:outline-none focus-visible:outline-none touch-none min-h-[100dvh]"
      onClick={setupAudio}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Tap to start audio. Space or Morph button to change shape."
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />
      <Link
        href="/"
        className="absolute z-10 flex items-center gap-2 text-white/60 hover:text-white/90 active:text-white/90 text-xs font-medium tracking-[0.2em] uppercase transition-colors min-h-[44px] min-w-[44px] pl-2 pt-2"
        style={{ top: "max(1rem, env(safe-area-inset-top))", left: "max(1rem, env(safe-area-inset-left))" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>
      {!audioReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
          <p
            className="text-white/90 text-base sm:text-lg uppercase px-4 text-center"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              letterSpacing: "0.5em",
            }}
          >
            {isTouch ? "Tap to start" : "Click to start"}
          </p>
        </div>
      )}
      {/* Instructions — bottom left, different copy for touch vs desktop */}
      <div
        className="absolute left-4 sm:left-5 text-white/40 text-[10px] sm:text-[11px] tracking-widest uppercase pointer-events-none select-none max-w-[60%]"
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          bottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {isTouch
          ? "Touch and hold to scatter · Tap Morph to change shape"
          : "Hold to scatter · Scroll to zoom"}
      </div>
      {/* Morph button — visible on touch devices (no space bar) */}
      {isTouch && (
        <button
          type="button"
          onClick={handleMorphTap}
          className="absolute left-1/2 -translate-x-1/2 z-10 px-4 py-2.5 min-h-[44px] rounded-full text-[10px] font-medium tracking-[0.2em] uppercase text-white/70 bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            bottom: "max(4rem, calc(env(safe-area-inset-bottom) + 3.5rem))",
          }}
        >
          Morph
        </button>
      )}
      {/* Sound icon — bottom right */}
      <button
        type="button"
        onClick={audioReady ? togglePause : setupAudio}
        className="absolute right-4 sm:right-5 z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/50 hover:text-white/90 active:text-white/90 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        aria-label={audioReady ? (isPaused ? "Play" : "Pause") : "Start audio"}
      >
        {audioReady && isPaused ? (
          <VolumeX className="w-5 h-5 shrink-0" strokeWidth={1.5} />
        ) : (
          <Volume2 className="w-5 h-5 shrink-0" strokeWidth={1.5} />
        )}
      </button>
    </div>
  )
}
