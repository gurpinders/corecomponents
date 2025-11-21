'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order')
    
    const [order, setOrder] = useState(null)
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (orderId) {
            fetchOrder()
        } else {
            setLoading(false)
        }
    }, [orderId])

    const fetchOrder = async () => {
        // Fetch order details
        const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        // Fetch order items
        const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)

        setOrder(orderData)
        setOrderItems(itemsData || [])
        setLoading(false)
    }

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading order details...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!order) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Order Not Found</h1>
                        <p className="text-gray-600 mb-8">We couldn't find that order.</p>
                        <Link href="/" className="text-blue-600 hover:underline">
                            Return to Home
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
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-8">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600 mb-4">Thank you for your order. We'll contact you shortly.</p>
                        <p className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}</p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                        {/* Customer Info */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                            <p className="text-gray-600">{order.customer_name}</p>
                            <p className="text-gray-600">{order.customer_email}</p>
                            <p className="text-gray-600">{order.customer_phone}</p>
                            {order.customer_company && (
                                <p className="text-gray-600">{order.customer_company}</p>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-2">Delivery Method</h3>
                            {order.delivery_method === 'pickup' && (
                                <div>
                                    <p className="text-gray-600">Pick up in Brampton</p>
                                    <p className="text-sm text-gray-500">We'll notify you when your order is ready</p>
                                </div>
                            )}
                            {order.delivery_method === 'delivery' && (
                                <div>
                                    <p className="text-gray-600">Local Delivery</p>
                                    <p className="text-gray-600">{order.delivery_address}</p>
                                    <p className="text-gray-600">{order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}</p>
                                </div>
                            )}
                            {order.delivery_method === 'shipping' && (
                                <div>
                                    <p className="text-gray-600">Shipping</p>
                                    <p className="text-gray-600">{order.delivery_address}</p>
                                    <p className="text-gray-600">{order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-4">Items Ordered</h3>
                            <div className="space-y-3">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between border-b pb-3">
                                        <div>
                                            <p className="font-medium">{item.part_name}</p>
                                            {item.part_sku && (
                                                <p className="text-sm text-gray-500">SKU: {item.part_sku}</p>
                                            )}
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">${item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.shipping > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (HST 13%)</span>
                                <span className="font-medium">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-2">What Happens Next?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>✓ You'll receive a confirmation email at {order.customer_email}</li>
                            <li>✓ We'll contact you at {order.customer_phone} to arrange payment</li>
                            {order.delivery_method === 'pickup' && (
                                <li>✓ We'll notify you when your order is ready for pickup</li>
                            )}
                            {order.delivery_method === 'delivery' && (
                                <li>✓ Your order will be delivered within 1-2 business days</li>
                            )}
                            {order.delivery_method === 'shipping' && (
                                <li>✓ You'll receive tracking information once shipped</li>
                            )}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Link
                            href="/catalog"
                            className="flex-1 bg-black text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-gray-200 text-gray-700 text-center px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}