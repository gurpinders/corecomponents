'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PartsList({ parts }) {
    const [visible, setVisible] = useState([])

    useEffect(() => {
        parts.forEach((_, index) => {
            setTimeout(() => {
                setVisible(prev => [...prev, index])
            }, index * 80)
        })
    }, [parts])

    return (
        <div className="flex flex-col gap-4 mb-12">
            {parts.map((part, index) => (
                <Link
                    key={part.id}
                    href={`/catalog/${part.id}`}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-6 justify-between hover:border-white/25 hover:bg-white/10 cursor-pointer"
                    style={{
                        opacity: visible.includes(index) ? 1 : 0,
                        transform: visible.includes(index) ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {part.images && part.images[0] ? (
                            <img
                                src={part.images[0]}
                                alt={part.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm md:text-base font-bold text-white leading-snug">{part.name}</h3>
                            {part.description && (
                                <p className="text-gray-400 text-xs mt-1 hidden md:block">{part.description}</p>
                            )}
                            {part.sku && (
                                <p className="text-gray-500 text-xs mt-1 hidden md:block">SKU: {part.sku}</p>
                            )}
                            {part.mileage_km != null && (
                                <p className="text-gray-500 text-xs mt-1 hidden md:block">{part.mileage_km.toLocaleString()} km</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            part.stock_status === 'in_stock'
                                ? 'bg-green-900/50 text-green-400'
                                : part.stock_status === 'low_stock'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-red-900/50 text-red-400'
                        }`}>
                            {part.stock_status === 'in_stock' ? 'In Stock' :
                             part.stock_status === 'low_stock' ? 'Low Stock' :
                             'Out of Stock'}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
            ))}
        </div>
    )
}