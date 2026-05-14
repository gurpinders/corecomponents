'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AdminProtection from '@/components/AdminProtection'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState({
        totalParts: 0, totalTrucks: 0, totalCustomers: 0, totalCampaigns: 0,
        totalQuotes: 0, newQuotes: 0, subscribedCustomers: 0,
        customersThisMonth: 0, customersLastMonth: 0,
        totalRevenue: 0, totalOrders: 0, avgOrderValue: 0,
        revenueThisMonth: 0, ordersThisMonth: 0
    })
    const [recentQuotes, setRecentQuotes] = useState([])
    const [recentCampaigns, setRecentCampaigns] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [lowStockParts, setLowStockParts] = useState([])
    const [quoteBreakdown, setQuoteBreakdown] = useState({ new: 0, contacted: 0, quoted: 0, closed: 0 })
    const [campaignPerformance, setCampaignPerformance] = useState([])

    useEffect(() => { fetchAllData() }, [])

    const fetchAllData = async () => {
        await Promise.all([
            fetchMetrics(), fetchRevenueData(), fetchRecentActivity(),
            fetchRecentOrders(), fetchTopProducts(), fetchLowStockParts(),
            fetchQuoteBreakdown(), fetchCampaignPerformance(), fetchCustomerGrowth()
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
            totalParts: parts.count || 0, totalTrucks: trucks.count || 0,
            totalCustomers: customers.count || 0, totalCampaigns: campaigns.count || 0,
            totalQuotes: quotes.count || 0, subscribedCustomers: subscribedCustomers.count || 0,
            newQuotes: newQuotes.count || 0
        }))
    }

    const fetchRevenueData = async () => {
        const { data: orders } = await supabase.from('orders').select('total, created_at').eq('status', 'completed')
        if (orders) {
            const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0)
            const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
            const now = new Date()
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const thisMonthOrders = orders.filter(o => new Date(o.created_at) >= startOfThisMonth)
            const revenueThisMonth = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.total), 0)
            setMetrics(prev => ({ ...prev, totalRevenue, totalOrders: orders.length, avgOrderValue, revenueThisMonth, ordersThisMonth: thisMonthOrders.length }))
        }
    }

    const fetchRecentActivity = async () => {
        const { data: quotes } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false }).limit(5)
        if (quotes) setRecentQuotes(quotes)
        const { data: campaigns } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false }).limit(5)
        if (campaigns) setRecentCampaigns(campaigns)
    }

    const fetchRecentOrders = async () => {
        const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
        if (orders) setRecentOrders(orders)
    }

    const fetchTopProducts = async () => {
        const { data: orderItems } = await supabase.from('order_items').select('part_name, quantity, part_id').not('part_id', 'is', null)
        if (orderItems) {
            const productCounts = {}
            orderItems.forEach(item => {
                if (item.part_id) {
                    if (!productCounts[item.part_id]) productCounts[item.part_id] = { name: item.part_name, count: 0 }
                    productCounts[item.part_id].count += item.quantity
                }
            })
            setTopProducts(Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5))
        }
    }

    const fetchLowStockParts = async () => {
        const { data: parts } = await supabase.from('parts').select('id, name, sku, stock_status')
            .or('stock_status.eq.low_stock,stock_status.eq.out_of_stock').order('stock_status', { ascending: false }).limit(5)
        if (parts) setLowStockParts(parts)
    }

    const fetchQuoteBreakdown = async () => {
        const { data: quotes } = await supabase.from('quote_requests').select('status')
        if (quotes) {
            setQuoteBreakdown({
                new: quotes.filter(q => q.status === 'new').length,
                contacted: quotes.filter(q => q.status === 'contacted').length,
                quoted: quotes.filter(q => q.status === 'quoted').length,
                closed: quotes.filter(q => q.status === 'closed').length
            })
        }
    }

    const fetchCampaignPerformance = async () => {
        const { data: campaigns } = await supabase.from('email_campaigns').select('id, campaign_name, recipients, status')
            .eq('status', 'sent').order('created_at', { ascending: false }).limit(3)
        if (campaigns) {
            const performancePromises = campaigns.map(async (campaign) => {
                const { data: tracking } = await supabase.from('email_tracking').select('event_type, customer_email').eq('campaign_id', campaign.id)
                if (tracking) {
                    const uniqueOpens = new Set(tracking.filter(t => t.event_type === 'open').map(t => t.customer_email)).size
                    const uniqueClicks = new Set(tracking.filter(t => t.event_type === 'click').map(t => t.customer_email)).size
                    return {
                        name: campaign.campaign_name,
                        openRate: campaign.recipients > 0 ? ((uniqueOpens / campaign.recipients) * 100).toFixed(1) : 0,
                        clickRate: campaign.recipients > 0 ? ((uniqueClicks / campaign.recipients) * 100).toFixed(1) : 0
                    }
                }
                return null
            })
            setCampaignPerformance((await Promise.all(performancePromises)).filter(p => p !== null))
        }
    }

    const fetchCustomerGrowth = async () => {
        const now = new Date()
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
        const [thisMonth, lastMonth] = await Promise.all([
            supabase.from('customers').select('id', { count: 'exact', head: true }).gte('created_at', startOfThisMonth),
            supabase.from('customers').select('id', { count: 'exact', head: true }).gte('created_at', startOfLastMonth).lt('created_at', startOfThisMonth)
        ])
        setMetrics(prev => ({ ...prev, customersThisMonth: thisMonth.count || 0, customersLastMonth: lastMonth.count || 0 }))
    }

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </main>
        )
    }

    const customerGrowth = metrics.customersThisMonth - metrics.customersLastMonth
    const growthPercentage = metrics.customersLastMonth > 0
        ? ((customerGrowth / metrics.customersLastMonth) * 100).toFixed(1) : 0

    const cardClass = "bg-white/5 border border-white/10 rounded-xl p-6"
    const labelClass = "text-sm text-gray-400 mb-1"
    const valueClass = "text-3xl font-bold text-white"
    const subClass = "text-sm text-gray-500 mt-2"

    return (
        <AdminProtection>
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening with your business.</p>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6">
                        <p className="text-sm text-green-400 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-white">${metrics.totalRevenue.toFixed(2)}</p>
                        <p className="text-sm text-green-400/60 mt-2">All completed orders</p>
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>Total Orders</p>
                        <p className={valueClass}>{metrics.totalOrders}</p>
                        <p className={subClass}>{metrics.ordersThisMonth} this month</p>
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>Avg Order Value</p>
                        <p className={valueClass}>${metrics.avgOrderValue.toFixed(2)}</p>
                        <p className={subClass}>Per completed order</p>
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>This Month</p>
                        <p className={valueClass}>${metrics.revenueThisMonth.toFixed(2)}</p>
                        <p className={subClass}>{metrics.ordersThisMonth} orders</p>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={cardClass}>
                        <p className={labelClass}>Inventory</p>
                        <p className={valueClass}>{metrics.totalParts + metrics.totalTrucks}</p>
                        <p className={subClass}>{metrics.totalParts} parts · {metrics.totalTrucks} trucks</p>
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>Customers</p>
                        <p className={valueClass}>{metrics.totalCustomers}</p>
                        <p className={subClass}>{metrics.subscribedCustomers} subscribed</p>
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>Quote Requests</p>
                        <p className={valueClass}>{metrics.totalQuotes}</p>
                        {metrics.newQuotes > 0 && (
                            <p className="text-sm text-red-400 font-medium mt-2">⚠️ {metrics.newQuotes} need attention</p>
                        )}
                    </div>
                    <div className={cardClass}>
                        <p className={labelClass}>Email Campaigns</p>
                        <p className={valueClass}>{metrics.totalCampaigns}</p>
                        <Link href="/admin/campaigns" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block transition-colors">
                            Manage →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={`${cardClass} mb-8`}>
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { href: '/admin/parts/new', label: '+ Add Part' },
                            { href: '/admin/trucks/new', label: '+ Add Truck' },
                            { href: '/admin/campaigns/new', label: '+ Create Campaign' },
                            { href: '/admin/orders', label: 'View Orders' },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="bg-white text-black px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-100 transition-colors"
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                {lowStockParts.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">⚠️ Low Stock Alerts</h3>
                            <Link href="/admin/parts" className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
                                Manage Inventory →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockParts.map((part) => (
                                <div key={part.id} className="bg-white/5 rounded-lg p-4 border-l-4 border-red-500">
                                    <p className="font-medium text-white text-sm">{part.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">SKU: {part.sku}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                                        part.stock_status === 'out_of_stock'
                                            ? 'bg-red-900/50 text-red-400'
                                            : 'bg-yellow-900/50 text-yellow-400'
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
                    <div className={cardClass}>
                        <h3 className="text-xl font-bold text-white mb-4">Quote Pipeline</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'New', value: quoteBreakdown.new, color: 'bg-blue-500' },
                                { label: 'Contacted', value: quoteBreakdown.contacted, color: 'bg-yellow-500' },
                                { label: 'Quoted', value: quoteBreakdown.quoted, color: 'bg-purple-500' },
                                { label: 'Closed', value: quoteBreakdown.closed, color: 'bg-green-500' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">{item.label}</span>
                                        <span className="font-bold text-white">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.value / metrics.totalQuotes * 100) || 0}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Growth */}
                    <div className={cardClass}>
                        <h3 className="text-xl font-bold text-white mb-4">Customer Growth</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">This Month</p>
                                <p className="text-3xl font-bold text-white">{metrics.customersThisMonth}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Last Month</p>
                                <p className="text-xl font-medium text-gray-300">{metrics.customersLastMonth}</p>
                            </div>
                            <div className={`text-sm font-medium ${customerGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {customerGrowth >= 0 ? '↑' : '↓'} {Math.abs(customerGrowth)} customers ({growthPercentage}%)
                            </div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className={cardClass}>
                        <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
                        {topProducts.length === 0 ? (
                            <p className="text-gray-500 text-sm">No sales data yet</p>
                        ) : (
                            <div className="space-y-3">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-white/20">#{index + 1}</span>
                                            <span className="text-sm text-white">{product.name}</span>
                                        </div>
                                        <span className="font-bold text-white">{product.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Campaign Performance */}
                {campaignPerformance.length > 0 && (
                    <div className={`${cardClass} mb-8`}>
                        <h3 className="text-xl font-bold text-white mb-4">Recent Campaign Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Campaign</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Open Rate</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Click Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaignPerformance.map((campaign, index) => (
                                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                                            <td className="py-3 px-4 text-sm font-medium text-white">{campaign.name}</td>
                                            <td className="py-3 px-4"><span className="text-sm font-medium text-green-400">{campaign.openRate}%</span></td>
                                            <td className="py-3 px-4"><span className="text-sm font-medium text-blue-400">{campaign.clickRate}%</span></td>
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
                    <div className={cardClass}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All →</Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-500 text-sm">No orders yet</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="border-b border-white/10 pb-3 last:border-b-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium text-white text-sm">{order.customer_name}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                order.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                                                order.status === 'processing' ? 'bg-blue-900/50 text-blue-400' :
                                                order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-white/10 text-gray-400'
                                            }`}>{order.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                            <span className="font-bold text-white text-sm">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Quotes */}
                    <div className={cardClass}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Recent Quotes</h3>
                            <Link href="/admin/quotes" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All →</Link>
                        </div>
                        {recentQuotes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No quote requests yet</p>
                        ) : (
                            <div className="space-y-3">
                                {recentQuotes.map((quote) => (
                                    <div key={quote.id} className="border-b border-white/10 pb-3 last:border-b-0">
                                        <p className="font-medium text-white text-sm">{quote.customer_name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{quote.message || 'No message'}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                quote.status === 'new' ? 'bg-blue-900/50 text-blue-400' :
                                                quote.status === 'contacted' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-green-900/50 text-green-400'
                                            }`}>{quote.status}</span>
                                            <span className="text-xs text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Campaigns */}
                    <div className={cardClass}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Recent Campaigns</h3>
                            <Link href="/admin/campaigns" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All →</Link>
                        </div>
                        {recentCampaigns.length === 0 ? (
                            <p className="text-gray-500 text-sm">No campaigns yet</p>
                        ) : (
                            <div className="space-y-3">
                                {recentCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="border-b border-white/10 pb-3 last:border-b-0">
                                        <p className="font-medium text-white text-sm">{campaign.campaign_name}</p>
                                        <p className="text-xs text-gray-400 mt-1 truncate">{campaign.subject}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                campaign.status === 'sent' ? 'bg-green-900/50 text-green-400' :
                                                campaign.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' :
                                                'bg-white/10 text-gray-400'
                                            }`}>{campaign.status}</span>
                                            <span className="text-xs text-gray-500">{campaign.recipients || 0} recipients</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </AdminProtection>
    )
}