"use client"

/**
 * Small preview of the particle orb: sphere only, rotation from mouse, no sound/scatter/morph.
 * Used for the Thesis project hover preview on the homepage.
 */

import { useEffect, useRef } from "react"

interface OrbPreviewProps {
  width: number
  height: number
  mouseX: number
  mouseY: number
}

interface Particle {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
  size: number
  opacity: number
  angle: number
  pulseOffset: number
  noiseOffsetX: number
  noiseOffsetY: number
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

export function OrbPreview({ width, height, mouseX, mouseY }: OrbPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width < 1 || height < 1) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    if (particlesRef.current.length === 0) {
      const radius = 120
      const numParticles = 800
      const positions = generateSphere(numParticles, radius)
      particlesRef.current = positions.map((pos) => ({
        ...pos,
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        size: 1 + Math.random() * 2,
        opacity: 0.35 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        pulseOffset: Math.random() * Math.PI * 2,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      }))
    }

    const noise = (x: number, y: number) =>
      Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.92)"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const particles = particlesRef.current
      timeRef.current += 0.012

      const mouseRotationY = mouseX * Math.PI
      const mouseRotationX = mouseY * Math.PI * 0.5
      const expansionFactor = 1.0
      const breathPulse = Math.sin(timeRef.current * 0.5) * 0.06 + 1

      const projected = particles.map((particle) => {
        const noiseX = noise(particle.noiseOffsetX + timeRef.current, timeRef.current) * 8
        const noiseY = noise(particle.noiseOffsetY + timeRef.current, timeRef.current * 0.8) * 8
        const noiseZ = noise(timeRef.current, particle.noiseOffsetX + particle.noiseOffsetY) * 8
        const pulse = Math.sin(timeRef.current * 2 + particle.pulseOffset) * 0.04 + 1
        let x = (particle.baseX * breathPulse * pulse + noiseX) * expansionFactor
        let y = (particle.baseY * breathPulse * pulse + noiseY) * expansionFactor
        let z = (particle.baseZ * breathPulse * pulse + noiseZ) * expansionFactor

        const cosY = Math.cos(mouseRotationY)
        const sinY = Math.sin(mouseRotationY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        const cosX = Math.cos(mouseRotationX)
        const sinX = Math.sin(mouseRotationX)
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const perspective = 500
        const scale = perspective / (perspective + z2)
        return {
          particle,
          screenX: centerX + x1 * scale,
          screenY: centerY + y2 * scale,
          scale,
          depth: z2,
          z: z2,
        }
      })

      projected.sort((a, b) => a.depth - b.depth)

      projected.forEach((p) => {
        const lineLength = (6 + Math.sin(timeRef.current * 3 + p.particle.pulseOffset) * 3) * p.scale
        const opacity = p.particle.opacity * Math.max(0.2, p.scale)
        const lineAngle = p.particle.angle + timeRef.current * 0.5
        const dx = Math.cos(lineAngle) * lineLength
        const dy = Math.sin(lineAngle) * lineLength
        const lightIntensity = Math.max(0.25, (p.z + 300) / 600)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * lightIntensity * 0.9})`
        ctx.lineWidth = (1 + p.particle.size * 0.2) * p.scale
        ctx.beginPath()
        ctx.moveTo(p.screenX - dx / 2, p.screenY - dy / 2)
        ctx.lineTo(p.screenX + dx / 2, p.screenY + dy / 2)
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [width, height, mouseX, mouseY])

  if (width < 1 || height < 1) return null
  return (
    <div
      className="overflow-hidden bg-black rounded-[inherit]"
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
    </div>
  )
}
