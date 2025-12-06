'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()
    // Use a ref to track the current theme value within the animation loop
    const themeRef = useRef(theme)

    useEffect(() => {
        themeRef.current = theme
    }, [theme])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth
                canvas.height = canvas.parentElement.clientHeight
            } else {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            }
            initParticles()
        }

        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            color: string

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 2 + 0.5
                this.speedX = Math.random() * 0.4 - 0.2
                this.speedY = Math.random() * 0.4 - 0.2

                // Initial color, will be overridden in draw based on theme
                this.color = 'rgba(255, 255, 255, 0.5)'
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                // Wrap around screen
                if (this.x > canvas!.width) this.x = 0
                if (this.x < 0) this.x = canvas!.width
                if (this.y > canvas!.height) this.y = 0
                if (this.y < 0) this.y = canvas!.height
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = themeRef.current === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(239, 68, 68, 0.6)' // Red in light, White in dark
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const initParticles = () => {
            particles = []
            // Adjust density factor for larger areas to prevent overcrowding, or keep it consistent?
            // 15000 is good for screens. For long pages, maybe slightly sparser? 
            // Let's keep 15000 (standard density).
            const particleCount = Math.min(300, (canvas.width * canvas.height) / 20000) // Increased max cap for long pages, slightly lower density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const maxDist = 150

                    if (distance < maxDist) {
                        ctx.beginPath()
                        const opacity = 1 - distance / maxDist
                        ctx.strokeStyle = themeRef.current === 'dark'
                            ? `rgba(255, 255, 255, ${opacity * 0.15})`
                            : `rgba(239, 68, 68, ${opacity * 0.15})` // Red lines light, White lines dark
                        ctx.lineWidth = 1
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }

            // Draw particles
            particles.forEach(particle => {
                particle.update()
                particle.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        // Create ResizeObserver to monitor parent size changes (e.g. content loading)
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas()
        })

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement)
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()
        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            resizeObserver.disconnect()
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    )
}
