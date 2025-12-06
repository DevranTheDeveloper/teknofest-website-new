'use client'

import { useEffect, useState } from 'react'

export default function HeroScrollOverlay() {
    const [opacity, setOpacity] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight
            // Darken up to 80% opacity. 
            // We start darkening immediately. By the time we scroll 100vh (section covered), it should be fully dark.
            // Multiplying by 1.2 makes it effortless to get fully dark before it's completely out of view if desired.
            const calculatedOpacity = Math.min((scrollY / windowHeight) * 1.0, 0.8)
            setOpacity(calculatedOpacity)
        }

        // Initial calc in case we start somewhat scrolled
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className="absolute inset-0 bg-black pointer-events-none z-20 will-change-[opacity]"
            style={{ opacity }}
        />
    )
}
