'use client'

import { useState, useEffect } from 'react'

const phrases = [
    'Professional Trucking Parts & Components',
    'Quality Parts. Fast Delivery.',
    'GTA\'s Trusted Parts Source.',
]

export default function HeroHeading() {
    const [displayed, setDisplayed] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = phrases[phraseIndex]

        const timeout = setTimeout(() => {
            if (!deleting) {
                setDisplayed(current.slice(0, charIndex + 1))
                setCharIndex(prev => prev + 1)
                if (charIndex + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 2000)
                }
            } else {
                setDisplayed(current.slice(0, charIndex - 1))
                setCharIndex(prev => prev - 1)
                if (charIndex - 1 === 0) {
                    setDeleting(false)
                    setPhraseIndex(prev => (prev + 1) % phrases.length)
                }
            }
        }, deleting ? 30 : 60)

        return () => clearTimeout(timeout)
    }, [charIndex, deleting, phraseIndex])

    return (
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg min-h-[1.2em]">
            {displayed}
            <span className="inline-block w-0.5 h-[0.9em] bg-white ml-1 align-middle animate-pulse" />
        </h1>
    )
}