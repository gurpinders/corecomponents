'use client'

import Link from 'next/link'

export default function HeroButtons({ partCount }) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {/* Shimmer Button */}
                <Link
                    href="/catalog"
                    className="relative overflow-hidden bg-white text-black px-6 py-3 rounded-lg text-base font-bold whitespace-nowrap group"
                >
                    <span className="relative z-10">Browse Parts →</span>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                </Link>
                <Link
                    href="/trucks"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                    View Trucks
                </Link>
            </div>

            {/* Pulse Dot + Stock Count */}
            {partCount > 0 && (
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                    </span>
                    <span className="text-white/60 text-sm">{partCount} parts currently in stock</span>
                </div>
            )}
        </div>
    )
}