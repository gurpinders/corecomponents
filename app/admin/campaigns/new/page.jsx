'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'

export default function NewCampaignPage() {
    const [formData, setFormData] = useState({ campaign_name: '', subject: '', headline: '' })
    const [parts, setParts] = useState([])
    const [selectedParts, setSelectedParts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    useEffect(() => {
        const fetchParts = async () => {
            const { data } = await supabase.from('parts').select('*').order('name')
            if (data) setParts(data)
        }
        fetchParts()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const togglePartSelection = (partId) => {
        setSelectedParts(selectedParts.includes(partId)
            ? selectedParts.filter(id => id !== partId)
            : [...selectedParts, partId])
    }

    const handleSaveDraft = async (e) => {
        e.preventDefault(); setLoading(true); setError(null)
        const { data: campaign, error: campaignError } = await supabase.from('email_campaigns').insert([{ ...formData, status: 'draft', recipients: 0 }]).select().single()
        if (campaignError) { setError(campaignError.message); setLoading(false); return }
        if (selectedParts.length > 0) {
            const campaignParts = selectedParts.map((partId, index) => ({ campaign_id: campaign.id, part_id: partId, display_order: index + 1 }))
            const { error: partsError } = await supabase.from('email_campaign_parts').insert(campaignParts)
            if (partsError) { setError(partsError.message); setLoading(false); return }
        }
        success('Campaign saved as draft!')
        router.push('/admin/campaigns')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Create New Campaign</h1>
                        <p className="text-gray-400 mt-2">Design your email flyer and select featured products</p>
                    </div>
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}

                    <form onSubmit={handleSaveDraft} className="space-y-6">
                        {/* Campaign Details */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Campaign Details</h2>
                            <div className="space-y-4">
                                <div><label className={labelClass}>Campaign Name *</label><input type="text" name="campaign_name" value={formData.campaign_name} onChange={handleChange} required placeholder="e.g., Spring Sale 2024" className={inputClass} /></div>
                                <div><label className={labelClass}>Email Subject Line *</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="e.g., 🚚 New Arrivals - Heavy Duty Parts" className={inputClass} /></div>
                                <div><label className={labelClass}>Headline Text</label><textarea name="headline" value={formData.headline} onChange={handleChange} rows="2" placeholder="e.g., Check out our latest products!" className={inputClass} /></div>
                            </div>
                        </div>

                        {/* Product Selection */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Select Products ({selectedParts.length} selected)</h2>
                            {parts.length === 0 ? (
                                <p className="text-gray-400">No products available. Add products first.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {parts.map((part) => (
                                        <div
                                            key={part.id}
                                            onClick={() => togglePartSelection(part.id)}
                                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedParts.includes(part.id) ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" checked={selectedParts.includes(part.id)} onChange={() => {}} className="mt-1" />
                                                <div className="flex-1">
                                                    {part.images && part.images[0] && (
                                                        <Image src={part.images[0]} alt={part.name} width={80} height={80} className="w-full h-32 object-cover rounded mb-2" />
                                                    )}
                                                    <h3 className="font-medium text-sm text-white">{part.name}</h3>
                                                    <p className="text-sm text-gray-400">${part.retail_price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button type="submit" disabled={loading || selectedParts.length === 0} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                {loading ? 'Saving...' : 'Save as Draft'}
                            </button>
                            <button type="button" onClick={() => router.push('/admin/campaigns')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">Cancel</button>
                        </div>
                        {selectedParts.length === 0 && <p className="text-sm text-red-400">Please select at least one product for your campaign.</p>}
                    </form>
                </div>
            </main>
        </AdminProtection>
    )
}