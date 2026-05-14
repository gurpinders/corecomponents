'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function CampaignAnalyticsPage({ params }) {
    const [campaign, setCampaign] = useState(null)
    const [analytics, setAnalytics] = useState({ totalOpens: 0, totalClicks: 0, uniqueOpens: 0, uniqueClicks: 0, openRate: 0, clickRate: 0, clickThroughRate: 0, topProducts: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params
            await fetchCampaign(id)
            await fetchAnalytics(id)
        }
        loadData()
    }, [params])

    const fetchCampaign = async (id) => {
        const { data, error } = await supabase.from('email_campaigns').select('*').eq('id', id).single()
        if (error) { setError(error.message); return }
        setCampaign(data)
    }

    const fetchAnalytics = async (id) => {
        const { data: events, error: eventsError } = await supabase.from('email_tracking').select('*, parts(name)').eq('campaign_id', id)
        if (eventsError) { setError(eventsError.message); setLoading(false); return }
        const opens = events.filter(e => e.event_type === 'open')
        const clicks = events.filter(e => e.event_type === 'click')
        const uniqueOpensSet = new Set(opens.map(e => e.customer_email))
        const uniqueClicksSet = new Set(clicks.map(e => e.customer_email))
        const productClicks = {}
        clicks.forEach(click => {
            if (click.part_id) {
                if (!productClicks[click.part_id]) productClicks[click.part_id] = { partId: click.part_id, partName: click.parts?.name || 'Unknown', clicks: 0 }
                productClicks[click.part_id].clicks++
            }
        })
        const topProducts = Object.values(productClicks).sort((a, b) => b.clicks - a.clicks).slice(0, 5)
        const recipients = campaign?.recipients || 0
        const uniqueOpens = uniqueOpensSet.size
        const uniqueClicks = uniqueClicksSet.size
        setAnalytics({
            totalOpens: opens.length, totalClicks: clicks.length, uniqueOpens, uniqueClicks,
            openRate: recipients > 0 ? ((uniqueOpens / recipients) * 100).toFixed(1) : 0,
            clickRate: recipients > 0 ? ((uniqueClicks / recipients) * 100).toFixed(1) : 0,
            clickThroughRate: uniqueOpens > 0 ? ((uniqueClicks / uniqueOpens) * 100).toFixed(1) : 0,
            topProducts
        })
        setLoading(false)
    }

    const cardClass = "bg-white/5 border border-white/10 rounded-xl p-6"

    if (loading) return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center py-8 text-gray-400">Loading analytics...</p>
                </div>
            </main>
        </AdminProtection>
    )

    if (error || !campaign) return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                        Error: {error || 'Campaign not found'}
                    </div>
                </div>
            </main>
        </AdminProtection>
    )

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-8">
                        <Link href="/admin/campaigns" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">← Back to Campaigns</Link>
                        <h1 className="text-3xl font-bold text-white">Campaign Analytics</h1>
                        <p className="text-gray-400 mt-2">{campaign.campaign_name}</p>
                    </div>

                    {/* Campaign Info */}
                    <div className={`${cardClass} mb-6`}>
                        <h2 className="text-xl font-bold text-white mb-4">Campaign Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Subject Line', value: campaign.subject },
                                { label: 'Recipients', value: campaign.recipients || 0 },
                                { label: 'Sent Date', value: campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-sm text-gray-400">{item.label}</p>
                                    <p className="font-medium text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {[
                            { label: 'Unique Opens', value: analytics.uniqueOpens, sub: `${analytics.totalOpens} total opens`, color: 'text-blue-400' },
                            { label: 'Open Rate', value: `${analytics.openRate}%`, sub: `of ${campaign.recipients} recipients`, color: 'text-green-400' },
                            { label: 'Unique Clicks', value: analytics.uniqueClicks, sub: `${analytics.totalClicks} total clicks`, color: 'text-purple-400' },
                            { label: 'Click-Through Rate', value: `${analytics.clickThroughRate}%`, sub: 'of unique opens', color: 'text-orange-400' },
                        ].map((metric) => (
                            <div key={metric.label} className={cardClass}>
                                <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{metric.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className={cardClass}>
                            <p className="text-sm text-gray-400 mb-1">Click Rate</p>
                            <p className="text-3xl font-bold text-white">{analytics.clickRate}%</p>
                            <p className="text-sm text-gray-500 mt-1">of all recipients clicked</p>
                        </div>
                        <div className={cardClass}>
                            <p className="text-sm text-gray-400 mb-2">Engagement Summary</p>
                            <div className="space-y-2">
                                {[
                                    { label: 'Delivered', value: campaign.recipients },
                                    { label: 'Opened', value: analytics.uniqueOpens },
                                    { label: 'Clicked', value: analytics.uniqueClicks },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between text-sm">
                                        <span className="text-gray-400">{item.label}:</span>
                                        <span className="font-medium text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className={cardClass}>
                        <h2 className="text-xl font-bold text-white mb-4">Top Clicked Products</h2>
                        {analytics.topProducts.length === 0 ? (
                            <p className="text-gray-400">No product clicks yet</p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.topProducts.map((product, index) => (
                                    <div key={product.partId} className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-white/20">#{index + 1}</span>
                                            <div>
                                                <p className="font-medium text-white">{product.partName}</p>
                                                <p className="text-sm text-gray-400">{product.clicks} {product.clicks === 1 ? 'click' : 'clicks'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right w-32">
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((product.clicks / analytics.totalClicks * 100), 100)}%` }}></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{((product.clicks / analytics.totalClicks) * 100).toFixed(0)}%</p>
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