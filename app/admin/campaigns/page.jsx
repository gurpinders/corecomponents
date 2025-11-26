'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sending, setSending] = useState(null)

    const router = useRouter()

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('email_campaigns')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setCampaigns(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const handleSendCampaign = async (campaignId) => {
        if (!confirm('Are you sure you want to send this campaign to all subscribed customers?')) return

        setSending(campaignId)

        try {
            const response = await fetch('/api/send-campaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaignId })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send campaign')
            }

            alert(data.message || 'Campaign sent successfully!')
            fetchCampaigns()
        } catch (error) {
            alert('Error sending campaign: ' + error.message)
        } finally {
            setSending(null)
        }
    }

    const handleDelete = async (campaignId) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return

        const { error } = await supabase
            .from('email_campaigns')
            .delete()
            .eq('id', campaignId)

        if (error) {
            alert('Error deleting campaign: ' + error.message)
        } else {
            fetchCampaigns()
        }
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Email Campaigns</h1>
                    <Link 
                        href="/admin/campaigns/new"
                        className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                    >
                        Create New Campaign
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8 text-gray-500">Loading campaigns...</p>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && campaigns.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
                            No campaigns yet. Create your first email campaign!
                        </p>
                        <Link 
                            href="/admin/campaigns/new"
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                        >
                            Create Campaign
                        </Link>
                    </div>
                )}

                {/* Campaigns Table */}
                {!loading && !error && campaigns.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Campaign Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject Line
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recipients
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sent Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{campaign.campaign_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {campaign.subject}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {campaign.recipients || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            {campaign.status === 'draft' && (
                                                <button
                                                    onClick={() => handleSendCampaign(campaign.id)}
                                                    disabled={sending === campaign.id}
                                                    className="text-green-600 hover:text-green-900 font-medium disabled:text-gray-400"
                                                >
                                                    {sending === campaign.id ? 'Sending...' : 'Send'}
                                                </button>
                                            )}
                                            {campaign.status === 'sent' && (
                                                <Link
                                                    href={`/admin/campaigns/${campaign.id}/analytics`}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Analytics
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDelete(campaign.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
        </AdminProtection>
        
    )
}