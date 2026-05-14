'use client'

import { useState, useEffect } from "react"
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
    const { success } = useToast()
    const { confirm } = useConfirm()

    const fetchCampaigns = async () => {
        const { data, error } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false })
        if (error) { setError(error.message); setLoading(false); return }
        setCampaigns(data)
        setLoading(false)
    }

    useEffect(() => { fetchCampaigns() }, [])

    const handleSendCampaign = async (campaignId) => {
        const confirmed = await confirm({ title: 'Send Campaign', message: 'Are you sure you want to send this campaign to all subscribed customers?', confirmText: 'Send Campaign', cancelText: 'Cancel', type: 'info' })
        if (!confirmed) return
        setSending(campaignId)
        try {
            const response = await fetch('/api/send-campaign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId }) })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Failed to send campaign')
            success(data.message || 'Campaign sent successfully!')
            fetchCampaigns()
        } catch (err) { error('Error sending campaign: ' + err.message) }
        finally { setSending(null) }
    }

    const handleDelete = async (campaignId) => {
        const confirmed = await confirm({ title: 'Delete Campaign', message: 'Are you sure you want to delete this campaign?', confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' })
        if (!confirmed) return
        const { error: deleteError } = await supabase.from('email_campaigns').delete().eq('id', campaignId)
        if (deleteError) { error('Failed to delete: ' + deleteError.message) }
        else { success('Campaign deleted!'); fetchCampaigns() }
    }

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Email Campaigns</h1>
                        <Link href="/admin/campaigns/new" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-100 text-center w-full sm:w-auto transition-colors">
                            + Create Campaign
                        </Link>
                    </div>

                    {loading && <p className="text-center py-8 text-gray-400">Loading campaigns...</p>}
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}

                    {!loading && !error && campaigns.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg mb-4">No campaigns yet. Create your first email campaign!</p>
                            <Link href="/admin/campaigns/new" className="inline-block bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">Create Campaign</Link>
                        </div>
                    )}

                    {/* Desktop Table */}
                    {!loading && !error && campaigns.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Campaign Name', 'Subject Line', 'Status', 'Recipients', 'Sent Date', 'Actions'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{campaign.campaign_name}</td>
                                                <td className="px-6 py-4"><div className="text-sm text-gray-400 max-w-xs truncate">{campaign.subject}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'sent' ? 'bg-green-900/50 text-green-400' : campaign.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' : 'bg-white/10 text-gray-400'}`}>
                                                        {campaign.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{campaign.recipients || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                    {campaign.status === 'draft' && (
                                                        <button onClick={() => handleSendCampaign(campaign.id)} disabled={sending === campaign.id} className="text-green-400 hover:text-green-300 font-medium disabled:opacity-50 transition-colors">
                                                            {sending === campaign.id ? 'Sending...' : 'Send'}
                                                        </button>
                                                    )}
                                                    {campaign.status === 'sent' && (
                                                        <Link href={`/admin/campaigns/${campaign.id}/analytics`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Analytics</Link>
                                                    )}
                                                    <button onClick={() => handleDelete(campaign.id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && campaigns.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h3 className="font-bold text-white text-lg mb-3">{campaign.campaign_name}</h3>
                                    <div className="space-y-3 border-t border-white/10 pt-3">
                                        <div><span className="text-sm font-medium text-gray-400 block mb-1">Subject:</span><p className="text-sm text-white">{campaign.subject}</p></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Status:</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'sent' ? 'bg-green-900/50 text-green-400' : campaign.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' : 'bg-white/10 text-gray-400'}`}>{campaign.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Recipients:</span>
                                            <span className="text-sm text-white">{campaign.recipients || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Sent:</span>
                                            <span className="text-sm text-white">{campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Not sent'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                                        {campaign.status === 'draft' && (
                                            <button onClick={() => handleSendCampaign(campaign.id)} disabled={sending === campaign.id} className="flex-1 bg-green-900/50 text-green-400 py-2 rounded-lg font-medium hover:bg-green-900/70 disabled:opacity-50 transition-colors">
                                                {sending === campaign.id ? 'Sending...' : 'Send Now'}
                                            </button>
                                        )}
                                        {campaign.status === 'sent' && (
                                            <Link href={`/admin/campaigns/${campaign.id}/analytics`} className="flex-1 bg-blue-900/50 text-blue-400 text-center py-2 rounded-lg font-medium hover:bg-blue-900/70 transition-colors">Analytics</Link>
                                        )}
                                        <button onClick={() => handleDelete(campaign.id)} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg font-medium hover:bg-red-900/70 transition-colors">Delete</button>
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