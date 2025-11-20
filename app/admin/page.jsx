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
        subscribedCustomers: 0
    })
    const [recentQuotes, setRecentQuotes] = useState([])
    const [recentCampaigns, setRecentCampaigns] = useState([])

    useEffect(() => {
        fetchMetrics()
        fetchRecentActivity()
    }, [])

    const fetchMetrics = async () => {
        const [parts, customers, campaigns, quotes, subscribedCustomers, newQuotes] = await Promise.all([
            supabase.from('parts').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }),
            supabase.from('email_campaigns').select('id', { count: 'exact', head: true }),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
            supabase.from('customers').select('id', { count: 'exact', head: true }).eq('subscribed', true),
            supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'new')
        ])

        setMetrics({
            totalParts: parts.count || 0,
            totalCustomers: customers.count || 0,
            totalCampaigns: campaigns.count || 0,
            totalQuotes: quotes.count || 0,
            subscribedCustomers: subscribedCustomers.count || 0,
            newQuotes: newQuotes.count || 0
        })
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
        
        setLoading(false)
    }

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <p className="text-center">Loading dashboard...</p>
            </main>
        )
    }

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