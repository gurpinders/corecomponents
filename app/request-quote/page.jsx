'use client'

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function RequestQuotePage() {
    const { cart, clearCart } = useCart()
    const router = useRouter()
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_company: '',
        customer_phone: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            // Create quote requests for each cart item
            const quoteRequests = cart.map(item => ({
                part_id: item.id,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_company: formData.customer_company,
                customer_phone: formData.customer_phone,
                quantity: item.quantity,
                message: formData.message,
                status: 'new'
            }))

            const { error: insertError } = await supabase
                .from('quote_requests')
                .insert(quoteRequests)

            if (insertError) throw insertError

            // Clear cart and redirect
            clearCart()
            router.push('/quote-success')
        } catch (err) {
            console.error('Quote request error:', err)
            setError('Failed to submit quote request. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Add items to your cart before requesting a quote.</p>
                        <a href="/catalog" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800">
                            Browse Catalog
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">Request a Quote</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Quote Items Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">Items for Quote</h2>
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                            <div className="w-16 h-16 flex-shrink-0">
                                                {item.images && item.images[0] ? (
                                                    <Image
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded"></div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold">{item.name}</h3>
                                                {item.sku && <p className="text-sm text-gray-500">SKU: {item.sku}</p>}
                                                <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-bold text-blue-900 mb-2">💡 What Happens Next?</h3>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li>✓ We'll review your quote request</li>
                                    <li>✓ Our team will contact you within 24 hours</li>
                                    <li>✓ You'll receive a detailed quote via email</li>
                                    <li>✓ No obligation to purchase</li>
                                </ul>
                            </div>
                        </div>

                        {/* Quote Request Form */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">Your Information</h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="John Smith"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.customer_email}
                                        onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customer_company}
                                        onChange={(e) => setFormData({...formData, customer_company: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="ABC Trucking"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.customer_phone}
                                        onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="(647) 123-4567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Information
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Any special requirements or questions..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quote Request'}
                                </button>

                                <a
                                    href="/cart"
                                    className="block w-full text-center text-gray-600 hover:text-black font-medium mt-4"
                                >
                                    ← Back to Cart
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}