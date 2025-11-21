'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AccountPage() {
    const router = useRouter()
    const { user } = useCart()
    const [customer, setCustomer] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }
        fetchCustomerData()
    }, [user])

    const fetchCustomerData = async () => {
        // Fetch customer info
        const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_user_id', user.id)
            .single()

        // Fetch customer orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_email', customerData?.email)
            .order('created_at', { ascending: false })
            .limit(5)

        setCustomer(customerData)
        setOrders(ordersData || [])
        setLoading(false)
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

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">My Account</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Customer Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">Account Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{customer?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{customer?.email}</p>
                                    </div>
                                    {customer?.phone && (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{customer?.phone}</p>
                                        </div>
                                    )}
                                    {customer?.company && (
                                        <div>
                                            <p className="text-sm text-gray-500">Company</p>
                                            <p className="font-medium">{customer?.company}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="font-bold text-green-900 mb-2">Customer Pricing Active!</h3>
                                <p className="text-sm text-green-800">You're saving 5% on all parts</p>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                                
                                {orders.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">No orders yet</p>
                                        <Link 
                                            href="/catalog"
                                            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {order.delivery_method}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}