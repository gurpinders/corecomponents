'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function CampaignAnalyticsPage({ params }) {
    const [campaignId, setCampaignId] = useState(null)
    const [campaign, setCampaign] = useState(null)
    const [analytics, setAnalytics] = useState({
        totalOpens: 0,
        totalClicks: 0,
        uniqueOpens: 0,
        uniqueClicks: 0,
        openRate: 0,
        clickRate: 0,
        topProducts: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params
            setCampaignId(id)
            await fetchCampaign(id)
            await fetchAnalytics(id)
        }
        loadData()
    }, [])

    const fetchCampaign = async (id) => {
        const { data, error } = await supabase
            .from('email_campaigns')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            setError(error.message)
            return
        }

        setCampaign(data)
    }

    const fetchAnalytics = async (id) => {
        // Get all tracking events for this campaign
        const { data: events, error: eventsError } = await supabase
            .from('email_tracking')
            .select('*, parts(name)')
            .eq('campaign_id', id)

        if (eventsError) {
            setError(eventsError.message)
            setLoading(false)
            return
        }

        // Calculate analytics
        const opens = events.filter(e => e.event_type === 'open')
        const clicks = events.filter(e => e.event_type === 'click')

        // Unique opens (unique emails)
        const uniqueOpensSet = new Set(opens.map(e => e.customer_email))
        const uniqueClicksSet = new Set(clicks.map(e => e.customer_email))

        // Product click counts
        const productClicks = {}
        clicks.forEach(click => {
            if (click.part_id) {
                if (!productClicks[click.part_id]) {
                    productClicks[click.part_id] = {
                        partId: click.part_id,
                        partName: click.parts?.name || 'Unknown',
                        clicks: 0
                    }
                }
                productClicks[click.part_id].clicks++
            }
        })

        const topProducts = Object.values(productClicks)
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5)

        setAnalytics({
            totalOpens: opens.length,
            totalClicks: clicks.length,
            uniqueOpens: uniqueOpensSet.size,
            uniqueClicks: uniqueClicksSet.size,
            openRate: campaign?.recipients > 0 
                ? ((uniqueOpensSet.size / campaign.recipients) * 100).toFixed(1)
                : 0,
            clickRate: campaign?.recipients > 0
                ? ((uniqueClicksSet.size / campaign.recipients) * 100).toFixed(1): 0,
            topProducts
        })

        setLoading(false)
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center py-8 text-gray-500">Loading analytics...</p>
                </div>
            </main>
        )
    }

    if (error || !campaign) {
        return (
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error || 'Campaign not found'}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/admin/campaigns"
                        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                    >
                        ← Back to Campaigns
                    </Link>
                    <h1 className="text-3xl font-bold">Campaign Analytics</h1>
                    <p className="text-gray-600 mt-2">{campaign.campaign_name}</p>
                </div>

                {/* Campaign Info */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Subject Line</p>
                            <p className="font-medium">{campaign.subject}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Recipients</p>
                            <p className="font-medium">{campaign.recipients || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sent Date</p>
                            <p className="font-medium">
                                {campaign.sent_at 
                                    ? new Date(campaign.sent_at).toLocaleDateString() 
                                    : 'Not sent'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Unique Opens</p>
                        <p className="text-3xl font-bold">{analytics.uniqueOpens}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {analytics.totalOpens} total opens
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Open Rate</p>
                        <p className="text-3xl font-bold">{analytics.openRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">
                            of {campaign.recipients} recipients
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Unique Clicks</p>
                        <p className="text-3xl font-bold">{analytics.uniqueClicks}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {analytics.totalClicks} total clicks
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Click Rate</p>
                        <p className="text-3xl font-bold">{analytics.clickRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">
                            of unique opens
                        </p>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Top Clicked Products</h2>
                    {analytics.topProducts.length === 0 ? (
                        <p className="text-gray-500">No product clicks yet</p>
                    ) : (
                        <div className="space-y-3">
                            {analytics.topProducts.map((product, index) => (
                                <div 
                                    key={product.partId}
                                    className="flex items-center justify-between border-b pb-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-gray-300">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium">{product.partName}</p>
                                            <p className="text-sm text-gray-500">
                                                {product.clicks} {product.clicks === 1 ? 'click' : 'clicks'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-black h-2 rounded-full"
                                                style={{
                                                    width: `${(product.clicks / analytics.totalClicks * 100)}%`
                                                }}
                                            ></div>
                                        </div>
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