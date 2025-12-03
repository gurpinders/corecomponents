'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sending, setSending] = useState(null)

    const router = useRouter()
    const { success } = useToast()
    const { confirm } = useConfirm()

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
        const confirmed = await confirm({
            title: 'Send Campaign',
            message: 'Are you sure you want to send this campaign to all subscribed customers?',
            confirmText: 'Send Campaign',
            cancelText: 'Cancel',
            type: 'info'
        })

        if (!confirmed) return

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

            success(data.message || 'Campaign sent successfully!')
            fetchCampaigns()
        } catch (err) {
            error('Error sending campaign: ' + err.message)
        } finally {
            setSending(null)
        }
    }

    const handleDelete = async (campaignId) => {
        const confirmed = await confirm({
            title: 'Delete Campaign',
            message: 'Are you sure you want to delete this campaign?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        })

        if (!confirmed) return

        const { error: deleteError } = await supabase
            .from('email_campaigns')
            .delete()
            .eq('id', campaignId)

        if (deleteError) {
            error('Failed to delete campaign: ' + deleteError.message)
        } else {
            success('Campaign deleted successfully!')
            fetchCampaigns()
        }
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Email Campaigns</h1>
                    <Link 
                        href="/admin/campaigns/new"
                        className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-800 text-center w-full sm:w-auto"
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

                {/* DESKTOP: Campaigns Table */}
                {!loading && !error && campaigns.length > 0 && (
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
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
                    </div>
                )}

                {/* MOBILE: Campaigns Cards */}
                {!loading && !error && campaigns.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="bg-white rounded-lg shadow p-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-3">{campaign.campaign_name}</h3>

                                <div className="space-y-3 border-t pt-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 block mb-1">Subject:</span>
                                        <p className="text-sm text-gray-900">{campaign.subject}</p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {campaign.status}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Recipients:</span>
                                        <span className="text-sm text-gray-900">{campaign.recipients || 0}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Sent Date:</span>
                                        <span className="text-sm text-gray-900">
                                            {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                    {campaign.status === 'draft' && (
                                        <button
                                            onClick={() => handleSendCampaign(campaign.id)}
                                            disabled={sending === campaign.id}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
                                        >
                                            {sending === campaign.id ? 'Sending...' : 'Send Now'}
                                        </button>
                                    )}
                                    {campaign.status === 'sent' && (
                                        <Link
                                            href={`/admin/campaigns/${campaign.id}/analytics`}
                                            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700"
                                        >
                                            View Analytics
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
        </AdminProtection>
        
    )
}