'use client'


import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function ProductDetailPage({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_company: '',
        customer_phone: '',
        quantity: 1,
        message: ''
    })
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)
    const [formError, setFormError] = useState('')

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormSubmitting(true)
        setFormError('')
        
        try {
            const { id } = await params
            const { error } = await supabase
                .from('quote_requests')
                .insert([{
                    part_id: id,
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_company: formData.customer_company,
                    customer_phone: formData.customer_phone,
                    quantity: formData.quantity,
                    message: formData.message,
                    status: 'new'
                }])
            
            if (error) throw error
            
            setFormSuccess(true)
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_company: '',
                customer_phone: '',
                quantity: 1,
                message: ''
            })
        } catch (error) {
            setFormError('Failed to submit quote request. Please try again.')
            console.error(error)
        } finally {
            setFormSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link href="/catalog" className="text-blue-600 hover:underline">
                    Back to Catalog
                </Link>
                </div>
            </main>
            <Footer />
            </div>
        )
    }

    return(
        <div>
            <Header />
            <main className='min-h-screen bg-gray-50 py-12'>
                <div className='max-w-7xl mx-auto px-6'>
                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-black">Home</Link>
                        {' / '}
                        <Link href="/catalog" className="hover:text-black">Catalog</Link>
                        {' / '}
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Image */}
                        <div>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    width={800} 
                                    height={600} 
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    
                        {/* Right: Details */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <p className="text-3xl font-bold text-gray-900 mb-4">Starting from ${product.price}</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                                product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                product.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {product.stock_status === 'in_stock' ? 'In Stock' : product.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                            </span>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                            {/* Quote Request Form */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Request a Quote</h2>
                                
                                {formSuccess && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                                        Quote request submitted successfully! We will contact you soon.
                                    </div>
                                )}
                                
                                {formError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                        {formError}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.customer_email}
                                            onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Company */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customer_company}
                                            onChange={(e) => setFormData({...formData, customer_company: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.customer_phone}
                                            onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Information
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={formSubmitting}
                                        className="w-full bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                                    >
                                        {formSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}