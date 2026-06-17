'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function PartDetailPage({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        async function fetchProduct() {
            const { id } = await params
            const { data } = await supabase
                .from('parts')
                .select('*')
                .eq('id', id)
                .single()
            setProduct(data)
            setLoading(false)
        }
        fetchProduct()
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

    if (!product) {
        return (
            <div className="bg-black">
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Part Not Found</h1>
                        <Link href="/catalog" className="text-blue-400 hover:text-blue-300">
                            Back to Catalog
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-12 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-sm text-gray-400 mb-4">
                            <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">{product.name}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">{product.name}</h1>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left — Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
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
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-white'
                                                    : 'border-white/10 hover:border-white/40'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right — Details */}
                        <div className="flex flex-col gap-6">

                            {/* Stock Status & SKU */}
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                    product.stock_status === 'in_stock'
                                        ? 'bg-green-900/50 text-green-400'
                                        : product.stock_status === 'low_stock'
                                        ? 'bg-yellow-900/50 text-yellow-400'
                                        : 'bg-red-900/50 text-red-400'
                                }`}>
                                    {product.stock_status === 'in_stock' ? 'In Stock' :
                                     product.stock_status === 'low_stock' ? 'Low Stock' :
                                     'Out of Stock'}
                                </span>
                                {product.sku && (
                                    <span className="text-gray-500 text-sm">SKU: {product.sku}</span>
                                )}
                                {product.mileage_km != null && (
                                    <span className="text-gray-500 text-sm">{product.mileage_km.toLocaleString()} km</span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h2 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Description</h2>
                                    <p className="text-white leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Inquiry CTA */}
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Interested in this part?</h2>
                                <p className="text-gray-400 mb-6">Call or text us to confirm availability, get pricing, and arrange delivery or pickup.</p>
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
                                href="/catalog"
                                className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                            >
                                ← Back to Catalog
                            </Link>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}