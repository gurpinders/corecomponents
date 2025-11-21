'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function RequestPartPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_company: '',
        part_description: '',
        vehicle_year: '',
        vehicle_make: '',
        vehicle_model: '',
        quantity: 1,
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Store in quote_requests table with special note
            const { error: submitError } = await supabase
                .from('quote_requests')
                .insert([{
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_phone: formData.customer_phone,
                    customer_company: formData.customer_company,
                    message: `PART REQUEST - Not in inventory
                    
Part Description: ${formData.part_description}
Vehicle: ${formData.vehicle_year} ${formData.vehicle_make} ${formData.vehicle_model}
Quantity: ${formData.quantity}

Additional Info: ${formData.message}`,
                    status: 'new',
                    quantity: formData.quantity
                }])

            if (submitError) throw submitError

            setSuccess(true)
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                customer_company: '',
                part_description: '',
                vehicle_year: '',
                vehicle_make: '',
                vehicle_model: '',
                quantity: 1,
                message: ''
            })

        } catch (err) {
            console.error('Submit error:', err)
            setError('Failed to submit request. Please try again or call us.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-4">Request a Part</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Can't find what you're looking for? We'll source it for you!
                    </p>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
                            <h3 className="font-bold mb-1">Request Received!</h3>
                            <p>We'll research your part and get back to you within 24 hours with pricing and availability.</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        required
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        required
                                        value={formData.customer_email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="customer_phone"
                                        required
                                        value={formData.customer_phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company</label>
                                    <input
                                        type="text"
                                        name="customer_company"
                                        value={formData.customer_company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            {/* Part Info */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Part Description *</label>
                                <input
                                    type="text"
                                    name="part_description"
                                    required
                                    placeholder="e.g., Front brake pads, alternator, headlight assembly"
                                    value={formData.part_description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Vehicle Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Year</label>
                                    <input
                                        type="text"
                                        name="vehicle_year"
                                        placeholder="2020"
                                        value={formData.vehicle_year}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Make</label>
                                    <input
                                        type="text"
                                        name="vehicle_make"
                                        placeholder="Freightliner"
                                        value={formData.vehicle_make}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Model</label>
                                    <input
                                        type="text"
                                        name="vehicle_model"
                                        placeholder="Cascadia"
                                        value={formData.vehicle_model}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Quantity *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    required
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Additional Information</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Part number, specifications, urgency, etc."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:bg-gray-400"
                            >
                                {loading ? 'Submitting...' : 'Submit Part Request'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}