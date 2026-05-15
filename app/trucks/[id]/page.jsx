'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function TruckDetailPage({ params }) {
    const [truck, setTruck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        async function fetchTruck() {
            const { id } = await params
            const { data } = await supabase
                .from('trucks')
                .select('*')
                .eq('id', id)
                .single()
            setTruck(data)
            setLoading(false)
        }
        fetchTruck()
    }, [params])

    if (loading) {
        return (
            <div className="bg-black">
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-400 text-xl">Loading...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!truck) {
        return (
            <div className="bg-black">
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Truck Not Found</h1>
                        <Link href="/trucks" className="text-blue-400 hover:text-blue-300">
                            Back to Trucks
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const specs = [
        { label: 'Year', value: truck.year },
        { label: 'Make', value: truck.make },
        { label: 'Model', value: truck.model },
        { label: 'Mileage', value: truck.mileage ? `${truck.mileage.toLocaleString()} miles` : null },
        { label: 'Engine', value: truck.engine },
        { label: 'Transmission', value: truck.transmission },
        { label: 'GVW', value: truck.gvw ? `${truck.gvw.toLocaleString()} lbs` : null },
        { label: 'Category', value: truck.truck_category },
        { label: 'Condition', value: truck.condition },
        { label: 'Color', value: truck.colour },
        { label: 'VIN', value: truck.vin },
    ].filter(s => s.value)

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-12 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-sm text-gray-400 mb-4">
                            <Link href="/trucks" className="hover:text-white transition-colors">Trucks</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">{truck.year} {truck.make} {truck.model}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {truck.year} {truck.make} {truck.model}
                        </h1>
                        <div className="flex gap-3">
                            {truck.truck_category && (
                                <span className="bg-navy text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                    {truck.truck_category}
                                </span>
                            )}
                            {truck.condition && (
                                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
                                    {truck.condition}
                                </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                truck.status === 'available'
                                    ? 'bg-green-900/50 text-green-400'
                                    : truck.status === 'pending'
                                    ? 'bg-yellow-900/50 text-yellow-400'
                                    : 'bg-red-900/50 text-red-400'
                            }`}>
                                {truck.status === 'available' ? 'Available' :
                                 truck.status === 'pending' ? 'Pending' : 'Sold'}
                            </span>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left — Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
                                {truck.images && truck.images.length > 0 ? (
                                    <img
                                        src={truck.images[selectedImage]}
                                        alt={`${truck.year} ${truck.make} ${truck.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-white/20">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm">No image available</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {truck.images && truck.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {truck.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-white'
                                                    : 'border-white/10 hover:border-white/40'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${truck.year} ${truck.make} ${truck.model} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right — Details */}
                        <div className="flex flex-col gap-6">

                            {/* Specifications */}
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/10">
                                    <h2 className="text-lg font-bold text-white">Specifications</h2>
                                </div>
                                <div className="divide-y divide-white/10">
                                    {specs.map((spec) => (
                                        <div key={spec.label} className="flex justify-between items-center px-6 py-3">
                                            <span className="text-gray-400 text-sm">{spec.label}</span>
                                            <span className="text-white text-sm font-medium capitalize">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            {truck.description && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h2 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Description</h2>
                                    <p className="text-white leading-relaxed whitespace-pre-line">{truck.description}</p>
                                </div>
                            )}

                            {/* Features */}
                            {truck.features && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h2 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Features</h2>
                                    <p className="text-white leading-relaxed whitespace-pre-line">{truck.features}</p>
                                </div>
                            )}

                            {/* Inquiry CTA */}
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Interested in this truck?</h2>
                                <p className="text-gray-400 mb-6">Call or text us to get pricing, ask questions, and arrange a viewing.</p>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href="tel:6479938235"
                                        className="bg-white text-black px-8 py-4 rounded-xl font-bold text-center text-lg hover:bg-gray-100 transition-colors"
                                    >
                                        📞 Call (647) 993-8235
                                    </a>
                                    <a
                                        href="sms:6479938235"
                                        className="bg-navy text-white px-8 py-4 rounded-xl font-bold text-center text-lg hover:bg-navy-light transition-colors"
                                    >
                                        💬 Text Us
                                    </a>
                                </div>
                            </div>

                            {/* Back Link */}
                            <Link
                                href="/trucks"
                                className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                            >
                                ← Back to Trucks
                            </Link>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}