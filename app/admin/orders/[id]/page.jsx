'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AdminProtection from '@/components/AdminProtection'

export default function AdminOrderDetailPage({ params }) {
    const [orderId, setOrderId] = useState(null)
    const [order, setOrder] = useState(null)
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params
            setOrderId(id)
            await fetchOrder(id)
        }
        loadData()
    }, [])

    const fetchOrder = async (id) => {
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', id)

        if (orderError || itemsError) {
            setError(orderError?.message || itemsError?.message)
        } else {
            setOrder(orderData)
            setOrderItems(itemsData)
        }
        setLoading(false)
    }

    const updateStatus = async (newStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (error) {
            alert('Error updating status: ' + error.message)
        } else {
            setOrder({ ...order, status: newStatus })
        }
    }

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <p className="text-center">Loading order...</p>
            </main>
        )
    }

    if (error || !order) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error || 'Order not found'}
                </div>
                <Link href="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Back to Orders
                </Link>
            </main>
        )
    }

    return (
        <AdminProtection>
            <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Orders
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="text-gray-600 mt-1">Order ID: {order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                        <select
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg font-medium"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between border-b pb-4 last:border-b-0">
                                    <div>
                                        <p className="font-medium">{item.part_name}</p>
                                        {item.part_sku && (
                                            <p className="text-sm text-gray-500">SKU: {item.part_sku}</p>
                                        )}
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">Order Notes</h2>
                            <p className="text-gray-700">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Customer & Delivery Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                        <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-medium">Name:</span> {order.customer_name}</p>
                            <p className="text-gray-700"><span className="font-medium">Email:</span> {order.customer_email}</p>
                            <p className="text-gray-700"><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                            {order.customer_company && (
                                <p className="text-gray-700"><span className="font-medium">Company:</span> {order.customer_company}</p>
                            )}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                        <p className="font-medium text-gray-900 capitalize mb-2">{order.delivery_method}</p>
                        {(order.delivery_method === 'delivery' || order.delivery_method === 'shipping') && (
                            <div className="text-gray-700">
                                <p>{order.delivery_address}</p>
                                <p>{order.delivery_city}, {order.delivery_province}</p>
                                <p>{order.delivery_postal_code}</p>
                            </div>
                        )}
                        {order.delivery_method === 'pickup' && (
                            <p className="text-gray-600 text-sm">Customer will pick up in Brampton</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2">
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
                                <span className="text-gray-600">Tax (HST)</span>
                                <span className="font-medium">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Date */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Timeline</h2>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                                <span className="font-medium">Created:</span>{' '}
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Updated:</span>{' '}
                                {new Date(order.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </AdminProtection>
    )
}