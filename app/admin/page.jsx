'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState({
        totalParts: 0,
        totalCustomers: 0,
        totalCampaigns: 0,
        totalQuotes: 0,
        newQuotes: 0,
        subscribedCustomers: 0,
        customersThisMonth: 0,
        customersLastMonth: 0
    })
    const [recentQuotes, setRecentQuotes] = useState([])
    const [recentCampaigns, setRecentCampaigns] = useState([])
    const [topProducts, setTopProducts] = useState([])
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
            fetchRecentActivity(),
            fetchTopProducts(),
            fetchQuoteBreakdown(),
            fetchCampaignPerformance(),
            fetchCustomerGrowth()
        ])
        setLoading(false)
    }

    const fetchMetrics = async () => {
        const [parts, customers, campaigns, quotes, subscribedCustomers, newQuotes] = await Promise.all([
            supabase.from('parts').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }),
            supabase.from('email_campaigns').select('id', { count: 'exact', head: true }),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }).eq('subscribed', true),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'new')
        ])

        setMetrics(prev => ({
            ...prev,
            totalParts: parts.count || 0,
            totalCustomers: customers.count || 0,
            totalCampaigns: campaigns.count || 0,
            totalQuotes: quotes.count || 0,
            subscribedCustomers: subscribedCustomers.count || 0,
            newQuotes: newQuotes.count || 0
        }))
    }

    const fetchRecentActivity = async () => {
        const { data: quotes } = await supabase
            .from('quote_requests')
            .select('*, parts(name)')
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

    const fetchTopProducts = async () => {
        const { data: quotes } = await supabase
            .from('quote_requests')
            .select('part_id, parts(name)')
            .not('part_id', 'is', null)

        if (quotes) {
            // Count occurrences of each product
            const productCounts = {}
            quotes.forEach(quote => {
                if (quote.part_id) {
                    if (!productCounts[quote.part_id]) {
                        productCounts[quote.part_id] = {
                            name: quote.parts?.name || 'Unknown',
                            count: 0
                        }
                    }
                    productCounts[quote.part_id].count++
                }
            })

            // Convert to array and sort
            const topProducts = Object.values(productCounts)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            setTopProducts(topProducts)
        }
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
            // Fetch analytics for each campaign
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
                <p className="text-center">Loading dashboard...</p>
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
                <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                <p className="text-gray-600">Here's what's happening with your business today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Total Parts</p>
                    <p className="text-3xl font-bold">{metrics.totalParts}</p>
                    <Link href="/admin/parts" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        Manage Parts →
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Customers</p>
                    <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
                    <p className="text-sm text-gray-600 mt-1">{metrics.subscribedCustomers} subscribed</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Quote Requests</p>
                    <p className="text-3xl font-bold">{metrics.totalQuotes}</p>
                    <p className="text-sm text-red-600 font-medium mt-1">{metrics.newQuotes} new</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Email Campaigns</p>
                    <p className="text-3xl font-bold">{metrics.totalCampaigns}</p>
                    <Link href="/admin/campaigns" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        View Campaigns →
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/parts/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800"
                    >
                        + Add New Part
                    </Link>
                    <Link
                        href="/admin/campaigns/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800"
                    >
                        + Create Campaign
                    </Link>
                    <Link
                        href="/admin/customers/new"
                        className="bg-black text-white px-6 py-4 rounded-lg text-center font-medium hover:bg-gray-800"
                    >
                        + Add Customer
                    </Link>
                </div>
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Quote Status Breakdown */}
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
                            {customerGrowth >= 0 ? '↑' : '↓'} {Math.abs(customerGrowth)} ({growthPercentage}%)
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Top Requested Products</h3>
                    {topProducts.length === 0 ? (
                        <p className="text-gray-500 text-sm">No data yet</p>
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
                                    <tr key={index} className="border-b">
                                        <td className="py-3 px-4 text-sm">{campaign.name}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium">{campaign.openRate}%</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium">{campaign.clickRate}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Quotes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Quote Requests</h3>
                        <Link href="/admin/quotes" className="text-sm text-blue-600 hover:text-blue-800">
                            View All →
                        </Link>
                    </div>
                    {recentQuotes.length === 0 ? (
                        <p className="text-gray-500">No quote requests yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentQuotes.map((quote) => (
                                <div key={quote.id} className="border-b pb-3">
                                    <p className="font-medium">{quote.customer_name}</p>
                                    <p className="text-sm text-gray-600">{quote.parts?.name || 'Product'}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
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
                        <p className="text-gray-500">No campaigns yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentCampaigns.map((campaign) => (
                                <div key={campaign.id} className="border-b pb-3">
                                    <p className="font-medium">{campaign.campaign_name}</p>
                                    <p className="text-sm text-gray-600">{campaign.subject}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
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