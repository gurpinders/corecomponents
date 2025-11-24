'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState({
        totalParts: 0,
        totalTrucks: 0,
        totalCustomers: 0,
        totalCampaigns: 0,
        totalQuotes: 0,
        newQuotes: 0,
        subscribedCustomers: 0,
        customersThisMonth: 0,
        customersLastMonth: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        revenueThisMonth: 0,
        ordersThisMonth: 0
    })
    const [recentQuotes, setRecentQuotes] = useState([])
    const [recentCampaigns, setRecentCampaigns] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [lowStockParts, setLowStockParts] = useState([])
    const [quoteBreakdown, setQuoteBreakdown] = useState({
        new: 0,
        contacted: 0,
        quoted: 0,
        closed: 0
    })
    const [campaignPerformance, setCampaignPerformance] = useState([])

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        await Promise.all([
            fetchMetrics(),
            fetchRevenueData(),
            fetchRecentActivity(),
            fetchRecentOrders(),
            fetchTopProducts(),
            fetchLowStockParts(),
            fetchQuoteBreakdown(),
            fetchCampaignPerformance(),
            fetchCustomerGrowth()
        ])
        setLoading(false)
    }

    const fetchMetrics = async () => {
        const [parts, trucks, customers, campaigns, quotes, subscribedCustomers, newQuotes] = await Promise.all([
            supabase.from('parts').select('id', { count: 'exact', head: true }),
            supabase.from('trucks').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }),
            supabase.from('email_campaigns').select('id', { count: 'exact', head: true }),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }).eq('subscribed', true),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'new')
        ])

        setMetrics(prev => ({
            ...prev,
            totalParts: parts.count || 0,
            totalTrucks: trucks.count || 0,
            totalCustomers: customers.count || 0,
            totalCampaigns: campaigns.count || 0,
            totalQuotes: quotes.count || 0,
            subscribedCustomers: subscribedCustomers.count || 0,
            newQuotes: newQuotes.count || 0
        }))
    }

    const fetchRevenueData = async () => {
        // Get all completed orders
        const { data: orders } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('status', 'completed')

        if (orders) {
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
            const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

            // This month's revenue
            const now = new Date()
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const thisMonthOrders = orders.filter(order => new Date(order.created_at) >= startOfThisMonth)
            const revenueThisMonth = thisMonthOrders.reduce((sum, order) => sum + parseFloat(order.total), 0)

            setMetrics(prev => ({
                ...prev,
                totalRevenue,
                totalOrders: orders.length,
                avgOrderValue,
                revenueThisMonth,
                ordersThisMonth: thisMonthOrders.length
            }))
        }
    }

    const fetchRecentActivity = async () => {
        const { data: quotes } = await supabase
            .from('quote_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        if (quotes) setRecentQuotes(quotes)

        const { data: campaigns } = await supabase
            .from('email_campaigns')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        if (campaigns) setRecentCampaigns(campaigns)
    }

    const fetchRecentOrders = async () => {
        const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        if (orders) setRecentOrders(orders)
    }

    const fetchTopProducts = async () => {
        const { data: orderItems } = await supabase
            .from('order_items')
            .select('part_name, quantity, part_id')
            .not('part_id', 'is', null)

        if (orderItems) {
            const productCounts = {}
            orderItems.forEach(item => {
                if (item.part_id) {
                    if (!productCounts[item.part_id]) {
                        productCounts[item.part_id] = {
                            name: item.part_name,
                            count: 0
                        }
                    }
                    productCounts[item.part_id].count += item.quantity
                }
            })

            const topProducts = Object.values(productCounts)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            setTopProducts(topProducts)
        }
    }

    const fetchLowStockParts = async () => {
        const { data: parts } = await supabase
            .from('parts')
            .select('id, name, sku, stock_status')
            .or('stock_status.eq.low_stock,stock_status.eq.out_of_stock')
            .order('stock_status', { ascending: false })
            .limit(5)

        if (parts) setLowStockParts(parts)
    }

    const fetchQuoteBreakdown = async () => {
        const { data: quotes } = await supabase
            .from('quote_requests')
            .select('status')

        if (quotes) {
            const breakdown = {
                new: quotes.filter(q => q.status === 'new').length,
                contacted: quotes.filter(q => q.status === 'contacted').length,
                quoted: quotes.filter(q => q.status === 'quoted').length,
                closed: quotes.filter(q => q.status === 'closed').length
            }
            setQuoteBreakdown(breakdown)
        }
    }

    const fetchCampaignPerformance = async () => {
        const { data: campaigns } = await supabase
            .from('email_campaigns')
            .select('id, campaign_name, recipients, status')
            .eq('status', 'sent')
            .order('created_at', { ascending: false })
            .limit(3)

        if (campaigns) {
            const performancePromises = campaigns.map(async (campaign) => {
                const { data: tracking } = await supabase
                    .from('email_tracking')
                    .select('event_type, customer_email')
                    .eq('campaign_id', campaign.id)

                if (tracking) {
                    const uniqueOpens = new Set(
                        tracking.filter(t => t.event_type === 'open').map(t => t.customer_email)
                    ).size

                    const uniqueClicks = new Set(
                        tracking.filter(t => t.event_type === 'click').map(t => t.customer_email)
                    ).size

                    return {
                        name: campaign.campaign_name,
                        openRate: campaign.recipients > 0 
                            ? ((uniqueOpens / campaign.recipients) * 100).toFixed(1)
                            : 0,
                        clickRate: campaign.recipients > 0
                            ? ((uniqueClicks / campaign.recipients) * 100).toFixed(1)
                            : 0
                    }
                }
                return null
            })

            const performance = (await Promise.all(performancePromises)).filter(p => p !== null)
            setCampaignPerformance(performance)
        }
    }

    const fetchCustomerGrowth = async () => {
        const now = new Date()
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
        const startOfThisMonthDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const [thisMonth, lastMonth] = await Promise.all([
            supabase.from('customers').select('id', { count: 'exact', head: true }).gte('created_at', startOfThisMonth),
            supabase.from('customers').select('id', { count: 'exact', head: true }).gte('created_at', startOfLastMonth).lt('created_at', startOfThisMonthDate)
        ])

        setMetrics(prev => ({
            ...prev,
            customersThisMonth: thisMonth.count || 0,
            customersLastMonth: lastMonth.count || 0
        }))
    }

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </main>
        )
    }

    const customerGrowth = metrics.customersThisMonth - metrics.customersLastMonth
    const growthPercentage = metrics.customersLastMonth > 0 
        ? ((customerGrowth / metrics.customersLastMonth) * 100).toFixed(1)
        : 0

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
            </div>

            {/* Top Metrics - Revenue Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg shadow-lg p-6">
                    <p className="text-sm text-green-800 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-900">${metrics.totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-green-700 mt-2">All completed orders</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">{metrics.totalOrders}</p>
                    <p className="text-sm text-gray-600 mt-2">{metrics.ordersThisMonth} this month</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold">${metrics.avgOrderValue.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-2">Per completed order</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">This Month</p>
                    <p className="text-3xl font-bold">${metrics.revenueThisMonth.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-2">{metrics.ordersThisMonth} orders</p>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Inventory</p>
                    <p className="text-3xl font-bold">{metrics.totalParts + metrics.totalTrucks}</p>
                    <div className="text-sm text-gray-600 mt-2">
                        {metrics.totalParts} parts • {metrics.totalTrucks} trucks
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Customers</p>
                    <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
                    <p className="text-sm text-gray-600 mt-2">{metrics.subscribedCustomers} subscribed</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Quote Requests</p>
                    <p className="text-3xl font-bold">{metrics.totalQuotes}</p>
                    {metrics.newQuotes > 0 && (
                        <p className="text-sm text-red-600 font-medium mt-2">⚠️ {metrics.newQuotes} need attention</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Email Campaigns</p>
                    <p className="text-3xl font-bold">{metrics.totalCampaigns}</p>
                    <Link href="/admin/campaigns" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        Manage →
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/parts/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
                    >
                        + Add Part
                    </Link>
                    <Link
                        href="/admin/trucks/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
                    >
                        + Add Truck
                    </Link>
                    <Link
                        href="/admin/campaigns/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
                    >
                        + Create Campaign
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
                    >
                        View Orders
                    </Link>
                </div>
            </div>

            {/* Alerts Section */}
            {lowStockParts.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-red-900 flex items-center gap-2">
                            ⚠️ Low Stock Alerts
                        </h3>
                        <Link href="/admin/parts" className="text-sm text-red-700 hover:text-red-900 font-medium">
                            Manage Inventory →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockParts.map((part) => (
                            <div key={part.id} className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                <p className="font-medium text-sm">{part.name}</p>
                                <p className="text-xs text-gray-600 mt-1">SKU: {part.sku}</p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                                    part.stock_status === 'out_of_stock' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {part.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'LOW STOCK'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Quote Pipeline */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Quote Pipeline</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">New</span>
                            <span className="font-bold text-blue-600">{quoteBreakdown.new}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(quoteBreakdown.new / metrics.totalQuotes * 100) || 0}%`}}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Contacted</span>
                            <span className="font-bold text-yellow-600">{quoteBreakdown.contacted}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${(quoteBreakdown.contacted / metrics.totalQuotes * 100) || 0}%`}}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Quoted</span>
                            <span className="font-bold text-purple-600">{quoteBreakdown.quoted}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(quoteBreakdown.quoted / metrics.totalQuotes * 100) || 0}%`}}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Closed</span>
                            <span className="font-bold text-green-600">{quoteBreakdown.closed}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: `${(quoteBreakdown.closed / metrics.totalQuotes * 100) || 0}%`}}></div>
                        </div>
                    </div>
                </div>

                {/* Customer Growth */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Customer Growth</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">This Month</p>
                            <p className="text-3xl font-bold">{metrics.customersThisMonth}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Last Month</p>
                            <p className="text-xl font-medium text-gray-600">{metrics.customersLastMonth}</p>
                        </div>
                        <div className={`text-sm font-medium ${customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {customerGrowth >= 0 ? '↑' : '↓'} {Math.abs(customerGrowth)} customers ({growthPercentage}%)
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>
                    {topProducts.length === 0 ? (
                        <p className="text-gray-500 text-sm">No sales data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-300">#{index + 1}</span>
                                        <span className="text-sm">{product.name}</span>
                                    </div>
                                    <span className="font-bold text-black">{product.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Performance */}
            {campaignPerformance.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Recent Campaign Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Campaign</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Open Rate</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Click Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaignPerformance.map((campaign, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium">{campaign.name}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-green-600">{campaign.openRate}%</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-blue-600">{campaign.clickRate}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
                            View All →
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-medium text-sm">{order.customer_name}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="font-bold text-sm">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Quotes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Quote Requests</h3>
                        <Link href="/admin/quotes" className="text-sm text-blue-600 hover:text-blue-800">
                            View All →
                        </Link>
                    </div>
                    {recentQuotes.length === 0 ? (
                        <p className="text-gray-500 text-sm">No quote requests yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentQuotes.map((quote) => (
                                <div key={quote.id} className="border-b pb-3 last:border-b-0">
                                    <p className="font-medium text-sm">{quote.customer_name}</p>
                                    <p className="text-xs text-gray-600 mt-1">{quote.message || 'No message'}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            quote.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                            quote.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {quote.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Campaigns */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Campaigns</h3>
                        <Link href="/admin/campaigns" className="text-sm text-blue-600 hover:text-blue-800">
                            View All →
                        </Link>
                    </div>
                    {recentCampaigns.length === 0 ? (
                        <p className="text-gray-500 text-sm">No campaigns yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentCampaigns.map((campaign) => (
                                <div key={campaign.id} className="border-b pb-3 last:border-b-0">
                                    <p className="font-medium text-sm">{campaign.campaign_name}</p>
                                    <p className="text-xs text-gray-600 mt-1 truncate">{campaign.subject}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {campaign.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {campaign.recipients || 0} recipients
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}