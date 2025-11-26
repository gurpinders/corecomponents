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
    const [activeTab, setActiveTab] = useState('overview')
    const [customer, setCustomer] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderItems, setOrderItems] = useState({})
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authLoading, setAuthLoading] = useState(true) // ← NEW: Track auth loading
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        province: '',
        postal_code: ''
    })

    // ← NEW: Separate effect to check auth state
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setAuthLoading(false)
            
            if (!session) {
                router.push('/login')
            }
        }
        
        checkAuth()
    }, [])

    // ← MODIFIED: Only fetch data when we have a user
    useEffect(() => {
        if (user && !authLoading) {
            fetchCustomerData()
        }
    }, [user, authLoading])

    const fetchCustomerData = async () => {
        // Fetch customer info
        const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .single()

        // Fetch ALL customer orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_email', user.email)
            .order('created_at', { ascending: false })

        setCustomer(customerData)
        setOrders(ordersData || [])
        
        if (customerData) {
            setEditForm({
                name: customerData.name || '',
                phone: customerData.phone || '',
                company: customerData.company || '',
                address: customerData.address || '',
                city: customerData.city || '',
                province: customerData.province || '',
                postal_code: customerData.postal_code || ''
            })
        }
        
        setLoading(false)
    }

    const fetchOrderItems = async (orderId) => {
        if (orderItems[orderId]) {
            setSelectedOrder(orderId)
            return
        }

        const { data } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)

        setOrderItems({ ...orderItems, [orderId]: data })
        setSelectedOrder(orderId)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm({ ...editForm, [name]: value })
    }

    const handleSaveProfile = async () => {
        setSaving(true)

        const { error } = await supabase
            .from('customers')
            .update(editForm)
            .eq('email', user.email)

        if (error) {
            alert('Error updating profile: ' + error.message)
        } else {
            setCustomer({ ...customer, ...editForm })
            setEditing(false)
            alert('Profile updated successfully!')
        }

        setSaving(false)
    }

    // ← NEW: Show loading while checking auth
    if (authLoading || loading) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading your account...</p>
                </main>
                <Footer />
            </div>
        )
    }

    const order = selectedOrder ? orders.find(o => o.id === selectedOrder) : null
    const items = selectedOrder ? orderItems[selectedOrder] : []

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">My Account</h1>
                        <p className="text-gray-600">Welcome back, {customer?.name || 'Customer'}!</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'overview'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'orders'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Orders ({orders.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === 'profile'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Profile
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                                            <p className="text-sm text-green-800 mb-1">Customer Discount</p>
                                            <p className="text-3xl font-bold text-green-900">5% OFF</p>
                                            <p className="text-sm text-green-700 mt-2">Active on all parts</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                                            <p className="text-sm text-gray-600 mt-2">Lifetime purchases</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                ${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2">All time</p>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-bold mb-4">Account Details</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{customer?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Name</p>
                                                    <p className="font-medium">{customer?.name || 'Not set'}</p>
                                                </div>
                                                {customer?.company && (
                                                    <div>
                                                        <p className="text-sm text-gray-500">Company</p>
                                                        <p className="font-medium">{customer.company}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('profile')}
                                                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Edit Profile →
                                            </button>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                                            {orders.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 mb-4">No orders yet</p>
                                                    <Link 
                                                        href="/catalog"
                                                        className="inline-block bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
                                                    >
                                                        Start Shopping
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {orders.slice(0, 3).map((order) => (
                                                        <div key={order.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                                                            <div>
                                                                <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <p className="font-bold">${order.total.toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {orders.length > 3 && (
                                                <button
                                                    onClick={() => setActiveTab('orders')}
                                                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    View All Orders →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Order History</h2>
                                    
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
                                            <p className="text-gray-600 mb-6">Start shopping to see your order history here</p>
                                            <Link 
                                                href="/catalog"
                                                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800"
                                            >
                                                Browse Catalog
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg mb-1">Order #{order.id.slice(0, 8)}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'long', 
                                                                    day: 'numeric' 
                                                                })}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Delivery Method</p>
                                                            <p className="font-medium capitalize">{order.delivery_method}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Customer</p>
                                                            <p className="font-medium">{order.customer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                            <p className="font-medium">{order.customer_phone}</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => fetchOrderItems(order.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        View Order Details →
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Profile Information</h2>
                                        {!editing && (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {editing ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={editForm.phone}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={editForm.company}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={editForm.address}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={editForm.city}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Province
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="province"
                                                        value={editForm.province}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                        placeholder="ON"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Postal Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="postal_code"
                                                        value={editForm.postal_code}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                        placeholder="A1A 1A1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditing(false)
                                                        setEditForm({
                                                            name: customer?.name || '',
                                                            phone: customer?.phone || '',
                                                            company: customer?.company || '',
                                                            address: customer?.address || '',
                                                            city: customer?.city || '',
                                                            province: customer?.province || '',
                                                            postal_code: customer?.postal_code || ''
                                                        })
                                                    }}
                                                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Personal Information</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Email</p>
                                                            <p className="font-medium">{customer?.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                                            <p className="font-medium">{customer?.name || 'Not set'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                            <p className="font-medium">{customer?.phone || 'Not set'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Company</p>
                                                            <p className="font-medium">{customer?.company || 'Not set'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Address</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Street Address</p>
                                                            <p className="font-medium">{customer?.address || 'Not set'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">City</p>
                                                            <p className="font-medium">{customer?.city || 'Not set'}</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Province</p>
                                                                <p className="font-medium">{customer?.province || 'Not set'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Postal Code</p>
                                                                <p className="font-medium">{customer?.postal_code || 'Not set'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-6 pb-6 border-b">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Date</p>
                                        <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <p className="font-bold capitalize">{order.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Delivery</p>
                                        <p className="font-medium capitalize">{order.delivery_method}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-4">Order Items</h3>
                            <div className="space-y-3 mb-6">
                                {items && items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-b pb-3">
                                        <div>
                                            <p className="font-medium">{item.part_name}</p>
                                            <p className="text-sm text-gray-600">SKU: {item.part_sku}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold">${item.subtotal.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Order Notes</p>
                                    <p className="text-sm text-gray-600">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}