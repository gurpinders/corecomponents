'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, getCartTotal, getCartSavings, user, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_company: '',
        delivery_method: 'pickup',
        delivery_address: '',
        delivery_city: '',
        delivery_province: 'ON',
        delivery_postal_code: '',
        notes: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const subtotal = getCartTotal()
            const tax = subtotal * 0.13
            const shipping = formData.delivery_method === 'shipping' ? 50 : 0 // Flat $50 shipping
            const total = subtotal + tax + shipping

            // Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_phone: formData.customer_phone,
                    customer_company: formData.customer_company,
                    delivery_method: formData.delivery_method,
                    delivery_address: formData.delivery_address,
                    delivery_city: formData.delivery_city,
                    delivery_province: formData.delivery_province,
                    delivery_postal_code: formData.delivery_postal_code,
                    subtotal: subtotal,
                    tax: tax,
                    shipping: shipping,
                    total: total,
                    status: 'pending',
                    notes: formData.notes
                }])
                .select()
                .single()

            if (orderError) throw orderError

            // Create order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                part_id: item.sku ? item.id : null, // NULL for trucks
                part_name: item.name, // This should now have truck name
                part_sku: item.sku || item.vin || 'TRUCK-' + item.id.substring(0, 8),
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // Clear cart
            clearCart()

            // Redirect to confirmation
            router.push(`/order-confirmation?order=${order.id}`)

        } catch (err) {
            console.error('Checkout error:', err)
            console.error('Error message:', err.message)
            console.error('Error details:', err.details)
            console.error('Error hint:', err.hint)
            setError(`Failed to complete order: ${err.message || 'Please try again.'}`)
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
                        <Link href="/catalog" className="text-blue-600 hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const subtotal = getCartTotal()
    const tax = subtotal * 0.13
    const shipping = formData.delivery_method === 'shipping' ? 50 : 0
    const total = subtotal + tax + shipping
    const savings = getCartSavings()

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                                {/* Name */}
                                <div className="mb-4">
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

                                {/* Email */}
                                <div className="mb-4">
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

                                {/* Phone */}
                                <div className="mb-4">
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

                                {/* Company */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                                    <input
                                        type="text"
                                        name="customer_company"
                                        value={formData.customer_company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>

                                <h2 className="text-2xl font-bold mb-6 mt-8">Delivery Method</h2>

                                {/* Delivery Method */}
                                <div className="mb-6 space-y-3">
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="pickup"
                                            checked={formData.delivery_method === 'pickup'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Pick up in Brampton</p>
                                            <p className="text-sm text-gray-600">FREE - Ready in 2-4 hours</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="delivery"
                                            checked={formData.delivery_method === 'delivery'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Local Delivery (GTA)</p>
                                            <p className="text-sm text-gray-600">FREE - Within 1-2 business days</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="shipping"
                                            checked={formData.delivery_method === 'shipping'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Shipping (Canada-wide)</p>
                                            <p className="text-sm text-gray-600">$50.00 - 3-7 business days</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Address (if delivery or shipping) */}
                                {(formData.delivery_method === 'delivery' || formData.delivery_method === 'shipping') && (
                                    <div className="space-y-4 mb-6">
                                        <h3 className="font-medium">Delivery Address</h3>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Street Address *</label>
                                            <input
                                                type="text"
                                                name="delivery_address"
                                                required
                                                value={formData.delivery_address}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    name="delivery_city"
                                                    required
                                                    value={formData.delivery_city}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Province *</label>
                                                <select
                                                    name="delivery_province"
                                                    required
                                                    value={formData.delivery_province}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                >
                                                    <option value="ON">Ontario</option>
                                                    <option value="QC">Quebec</option>
                                                    <option value="BC">British Columbia</option>
                                                    <option value="AB">Alberta</option>
                                                    <option value="MB">Manitoba</option>
                                                    <option value="SK">Saskatchewan</option>
                                                    <option value="NS">Nova Scotia</option>
                                                    <option value="NB">New Brunswick</option>
                                                    <option value="NL">Newfoundland</option>
                                                    <option value="PE">PEI</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Postal Code *</label>
                                            <input
                                                type="text"
                                                name="delivery_postal_code"
                                                required
                                                value={formData.delivery_postal_code}
                                                onChange={handleChange}
                                                placeholder="A1A 1A1"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        rows="3"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Any special instructions..."
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:bg-gray-400"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="text-sm">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="ml-auto text-sm font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {user && savings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Savings</span>
                                            <span className="font-medium">-${savings.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {shipping > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">${shipping.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (HST 13%)</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t pt-2 flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}