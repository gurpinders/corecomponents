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
    const [authLoading, setAuthLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '', phone: '', company: '',
        address: '', city: '', province: '', postal_code: ''
    })

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setAuthLoading(false)
            if (!session) router.push('/login')
        }
        checkAuth()
    }, [])

    useEffect(() => {
        if (user && !authLoading) fetchCustomerData()
    }, [user, authLoading])

    const fetchCustomerData = async () => {
        const { data: customerData } = await supabase
            .from('customers').select('*').eq('email', user.email).single()

        const { data: ordersData } = await supabase
            .from('orders').select('*').eq('customer_email', user.email)
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
        if (orderItems[orderId]) { setSelectedOrder(orderId); return }
        const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId)
        setOrderItems({ ...orderItems, [orderId]: data })
        setSelectedOrder(orderId)
    }

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        const { error } = await supabase.from('customers').update(editForm).eq('email', user.email)
        if (error) { alert('Error updating profile: ' + error.message) }
        else { setCustomer({ ...customer, ...editForm }); setEditing(false); alert('Profile updated successfully!') }
        setSaving(false)
    }

    if (authLoading || loading) {
        return (
            <div className="bg-black">
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-400 text-xl">Loading your account...</p>
                </main>
                <Footer />
            </div>
        )
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const order = selectedOrder ? orders.find(o => o.id === selectedOrder) : null
    const items = selectedOrder ? orderItems[selectedOrder] : []

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <h1 className="text-5xl font-bold text-white mb-2">My Account</h1>
                        <p className="text-gray-400">Welcome back, {customer?.name || 'Customer'}!</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* Tabs */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="border-b border-white/10">
                            <nav className="flex space-x-1 px-6">
                                {[
                                    { id: 'overview', label: 'Overview' },
                                    { id: 'orders', label: `Orders (${orders.length})` },
                                    { id: 'profile', label: 'Profile' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-white text-white'
                                                : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-navy border border-navy-light rounded-xl p-6">
                                            <p className="text-sm text-white/60 mb-1">Customer Discount</p>
                                            <p className="text-3xl font-bold text-white">5% OFF</p>
                                            <p className="text-sm text-white/50 mt-2">Active on all parts</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <p className="text-sm text-gray-400 mb-1">Total Orders</p>
                                            <p className="text-3xl font-bold text-white">{orders.length}</p>
                                            <p className="text-sm text-gray-500 mt-2">Lifetime purchases</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <p className="text-sm text-gray-400 mb-1">Total Spent</p>
                                            <p className="text-3xl font-bold text-white">
                                                ${orders.reduce((sum, o) => sum + parseFloat(o.total), 0).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">All time</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="font-medium text-white">{customer?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Name</p>
                                                    <p className="font-medium text-white">{customer?.name || 'Not set'}</p>
                                                </div>
                                                {customer?.company && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Company</p>
                                                        <p className="font-medium text-white">{customer.company}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('profile')}
                                                className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                            >
                                                Edit Profile →
                                            </button>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                            {orders.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-400 mb-4">No orders yet</p>
                                                    <Link href="/catalog" className="inline-block bg-white text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">
                                                        Browse Parts
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {orders.slice(0, 3).map((order) => (
                                                        <div key={order.id} className="flex justify-between items-center pb-3 border-b border-white/10 last:border-b-0">
                                                            <div>
                                                                <p className="font-medium text-white text-sm">Order #{order.id.slice(0, 8)}</p>
                                                                <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="font-bold text-white">${order.total.toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {orders.length > 3 && (
                                                <button onClick={() => setActiveTab('orders')} className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
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
                                    <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-400 text-lg mb-4">No orders yet</p>
                                            <Link href="/catalog" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
                                                Browse Catalog
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border border-white/10 rounded-xl p-6 hover:border-white/25 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-white text-lg mb-1">Order #{order.id.slice(0, 8)}</h3>
                                                            <p className="text-sm text-gray-400">
                                                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                                            order.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                                                            order.status === 'processing' ? 'bg-blue-900/50 text-blue-400' :
                                                            order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                            'bg-white/10 text-gray-400'
                                                        }`}>
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/10">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                                            <p className="font-bold text-white text-lg">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Delivery</p>
                                                            <p className="font-medium text-white capitalize">{order.delivery_method}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Customer</p>
                                                            <p className="font-medium text-white">{order.customer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                            <p className="font-medium text-white">{order.customer_phone}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => fetchOrderItems(order.id)} className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
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
                                        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                                        {!editing && (
                                            <button onClick={() => setEditing(true)} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {editing ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                                                    <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                                    <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} className={inputClass} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                                                <input type="text" name="company" value={editForm.company} onChange={handleEditChange} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                                                <input type="text" name="address" value={editForm.address} onChange={handleEditChange} className={inputClass} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                                                    <input type="text" name="city" value={editForm.city} onChange={handleEditChange} className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Province</label>
                                                    <input type="text" name="province" value={editForm.province} onChange={handleEditChange} placeholder="ON" className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                                                    <input type="text" name="postal_code" value={editForm.postal_code} onChange={handleEditChange} placeholder="A1A 1A1" className={inputClass} />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button onClick={handleSaveProfile} disabled={saving} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditing(false)
                                                        setEditForm({
                                                            name: customer?.name || '', phone: customer?.phone || '',
                                                            company: customer?.company || '', address: customer?.address || '',
                                                            city: customer?.city || '', province: customer?.province || '',
                                                            postal_code: customer?.postal_code || ''
                                                        })
                                                    }}
                                                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                                <h3 className="text-sm font-medium text-gray-400 mb-4">Personal Information</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: 'Email', value: customer?.email },
                                                        { label: 'Full Name', value: customer?.name },
                                                        { label: 'Phone', value: customer?.phone },
                                                        { label: 'Company', value: customer?.company },
                                                    ].map((item) => (
                                                        <div key={item.label}>
                                                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                                            <p className="font-medium text-white">{item.value || 'Not set'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                                <h3 className="text-sm font-medium text-gray-400 mb-4">Address</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: 'Street Address', value: customer?.address },
                                                        { label: 'City', value: customer?.city },
                                                        { label: 'Province', value: customer?.province },
                                                        { label: 'Postal Code', value: customer?.postal_code },
                                                    ].map((item) => (
                                                        <div key={item.label}>
                                                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                                            <p className="font-medium text-white">{item.value || 'Not set'}</p>
                                                        </div>
                                                    ))}
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
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-2xl transition-colors">×</button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 pb-6 border-b border-white/10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Order ID', value: `#${order.id.slice(0, 8)}` },
                                        { label: 'Date', value: new Date(order.created_at).toLocaleDateString() },
                                        { label: 'Status', value: order.status },
                                        { label: 'Delivery', value: order.delivery_method },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                            <p className="font-medium text-white capitalize">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
                            <div className="space-y-3 mb-6">
                                {items && items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-3">
                                        <div>
                                            <p className="font-medium text-white">{item.part_name}</p>
                                            <p className="text-sm text-gray-400">SKU: {item.part_sku}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-white">${item.subtotal.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                {[
                                    { label: 'Subtotal', value: order.subtotal },
                                    { label: 'Tax', value: order.tax },
                                    { label: 'Shipping', value: order.shipping },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between text-sm">
                                        <span className="text-gray-400">{item.label}</span>
                                        <span className="font-medium text-white">${item.value.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-white">${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="mt-6 bg-white/5 rounded-xl p-4">
                                    <p className="text-sm font-medium text-gray-400 mb-1">Order Notes</p>
                                    <p className="text-sm text-white">{order.notes}</p>
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