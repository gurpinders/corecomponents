'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function TruckDetailPage({ params }) {
    const [truck, setTruck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0) // ← NEW: Track selected image
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_company: '',
        customer_phone: '',
        message: ''
    })
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)
    const [formError, setFormError] = useState('')
    
    const { user, addToCart } = useCart()

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormSubmitting(true)
        setFormError('')
        
        try {
            const { id } = await params
            const { error } = await supabase
                .from('quote_requests')
                .insert([{
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_company: formData.customer_company,
                    customer_phone: formData.customer_phone,
                    message: `TRUCK QUOTE REQUEST
                    
Truck: ${truck.year} ${truck.make} ${truck.model}
VIN: ${truck.vin}
Mileage: ${truck.mileage} miles

Customer Message: ${formData.message}`,
                    status: 'new',
                    quantity: 1
                }])
            
            if (error) throw error
            
            setFormSuccess(true)
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_company: '',
                customer_phone: '',
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
                <main className='min-h-screen bg-gray-50 py-12 flex items-center justify-center'>
                    <p className='text-xl text-gray-600'>Loading...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!truck) {
        return (
            <div>
                <Header />
                <main className='min-h-screen bg-gray-50 py-12 flex items-center justify-center'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Truck Not Found</h1>
                        <Link href="/trucks" className='text-blue-600 hover:underline'>
                            Back to Trucks
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
                        <Link href="/trucks" className="hover:text-black">Trucks</Link>
                        {' / '}
                        <span className="text-gray-900">{truck.year} {truck.make} {truck.model}</span>
                    </div>

                    {/* Truck Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                                {truck.images && truck.images.length > 0 ? (
                                    <Image 
                                        src={truck.images[selectedImage]} 
                                        alt={`${truck.year} ${truck.make} ${truck.model}`}
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

                            {/* Thumbnail Gallery - ONLY SHOW IF MULTIPLE IMAGES */}
                            {truck.images && truck.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {truck.images.map((image, index) => (
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
                                                alt={`${truck.year} ${truck.make} ${truck.model} - Image ${index + 1}`}
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
                            {/* Truck Title */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {truck.year} {truck.make} {truck.model}
                            </h1>

                            {/* Category & Condition */}
                            <div className="flex gap-3 mb-6">
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                    {truck.truck_category}
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 capitalize">
                                    {truck.condition}
                                </span>
                            </div>

                            {/* Pricing */}
                            <div className="mb-6 pb-6 border-b">
                                {user ? (
                                    // Logged in - show both prices
                                    <div>
                                        <p className="text-sm text-gray-500 line-through">
                                            Retail: ${truck.retail_price.toLocaleString()}
                                        </p>
                                        <p className="text-4xl font-bold text-black">
                                            Your Price: ${truck.customer_price.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-green-600 font-medium">
                                            You save ${(truck.retail_price - truck.customer_price).toLocaleString()}!
                                        </p>
                                    </div>
                                ) : (
                                    // Not logged in - show retail price
                                    <div>
                                        <p className="text-4xl font-bold text-black">
                                            Starting at ${truck.retail_price.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Sign in for exclusive customer pricing
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">Mileage:</span>
                                        <span className="text-gray-900">{truck.mileage.toLocaleString()} miles</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">Engine:</span>
                                        <span className="text-gray-900">{truck.engine}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">Transmission:</span>
                                        <span className="text-gray-900">{truck.transmission}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">GVW:</span>
                                        <span className="text-gray-900">{truck.gvw.toLocaleString()} lbs</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">VIN:</span>
                                        <span className="text-gray-900 font-mono text-sm">{truck.vin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-700">Color:</span>
                                        <span className="text-gray-900">{truck.colour}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {truck.description && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-3">Description</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {truck.description}
                                    </p>
                                </div>
                            )}

                            {/* Features */}
                            {truck.features && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-3">Features</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {truck.features}
                                    </p>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => {
                                    // Add truck with proper fields for cart/checkout
                                    const truckForCart = {
                                        ...truck,
                                        id: truck.id,
                                        name: `${truck.year} ${truck.make} ${truck.model}`, // Proper name
                                        price: user ? truck.customer_price : truck.retail_price,
                                        sku: null, // Trucks don't have SKU
                                        vin: truck.vin,
                                        year: truck.year,
                                        make: truck.make,
                                        model: truck.model
                                    }
                                    addToCart(truckForCart, 1)
                                    alert('Truck added to cart!')
                                }}
                                className="w-full bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 mb-4"
                            >
                                Add to Cart
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
                                            placeholder="Any questions or special requirements..."
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