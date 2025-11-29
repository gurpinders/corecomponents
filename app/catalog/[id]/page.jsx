'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useToast } from '@/lib/ToastContext'

export default function ProductDetailPage({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
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
    const { user, addToCart } = useCart()
    const { success } = useToast()

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

    const handleAddToCart = () => {
        const cartItem = {
            ...product,
            price: user ? product.customer_price : product.retail_price
        }
        addToCart(cartItem, 1)
        success(`${product.name} added to cart!`)
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

    return (
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
                        {/* Left: Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                                {product.images && product.images.length > 0 ? (
                                    <Image 
                                        src={product.images[selectedImage]} 
                                        alt={product.name} 
                                        width={800} 
                                        height={600} 
                                        className="w-full h-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                        <p className="text-gray-500">No image available</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-24 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-black' 
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    
                        {/* Right: Details */}
                        <div>
                            {/* Product Title */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* SKU & Stock Status */}
                            <div className="flex items-center gap-4 mb-6">
                                {product.sku && (
                                    <p className="text-sm text-gray-600">
                                        SKU: {product.sku}
                                    </p>
                                )}
                                
                                {product.stock_status && (
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                        product.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stock_status === 'in_stock' ? 'In Stock' :
                                         product.stock_status === 'low_stock' ? 'Low Stock' :
                                         'Out of Stock'}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Pricing - PROFESSIONAL OPTION 4 */}
                            <div className="mb-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                {user ? (
                                    // Logged in - show member pricing
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Regular Price</p>
                                        <p className="text-lg text-gray-500 line-through mb-3">
                                            ${product.retail_price}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">Your Member Price ✨</p>
                                        <p className="text-4xl font-bold text-black mb-2">
                                            ${product.customer_price}
                                        </p>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                                            <p className="text-sm text-green-700 font-semibold">
                                                💚 You save ${(product.retail_price - product.customer_price).toFixed(2)} ({Math.round(((product.retail_price - product.customer_price) / product.retail_price) * 100)}% off)
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Not logged in - show professional pricing with login prompt
                                    <div>
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <p className="text-sm text-gray-600 mb-1">Regular Price</p>
                                            <p className="text-2xl font-semibold text-gray-900">
                                                ${product.retail_price}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-1">Member Price ✨</p>
                                            <p className="text-4xl font-bold text-black">
                                                ${product.customer_price}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl">🔐</span>
                                                <div className="flex-1">
                                                    <p className="text-blue-900 font-semibold mb-1">
                                                        Sign in to unlock member pricing
                                                    </p>
                                                    <p className="text-blue-700 text-sm">
                                                        Save ${(product.retail_price - product.customer_price).toFixed(2)} ({Math.round(((product.retail_price - product.customer_price) / product.retail_price) * 100)}% off) when you create an account!
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Link
                                                    href="/signup"
                                                    className="flex-1 bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                                >
                                                    Create Account
                                                </Link>
                                                <Link
                                                    href="/login"
                                                    className="flex-1 bg-white text-black text-center py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                                                >
                                                    Login
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_status === 'out_of_stock'}
                                className="w-full bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 mb-8 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                            >
                                {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            {/* Divider */}
                            <hr className="my-8" />

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