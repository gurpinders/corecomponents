'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function NewCampaignPage() {
    const [formData, setFormData] = useState({
        campaign_name: '',
        subject: '',
        headline: ''
    })
    const [parts, setParts] = useState([])
    const [selectedParts, setSelectedParts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const router = useRouter()

    // Fetch all parts for selection
    useEffect(() => {
        const fetchParts = async () => {
            const { data } = await supabase
                .from('parts')
                .select('*')
                .order('name')
            
            if (data) setParts(data)
        }
        fetchParts()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const togglePartSelection = (partId) => {
        if (selectedParts.includes(partId)) {
            setSelectedParts(selectedParts.filter(id => id !== partId))
        } else {
            setSelectedParts([...selectedParts, partId])
        }
    }

    const handleSaveDraft = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Insert campaign
        const { data: campaign, error: campaignError } = await supabase
            .from('email_campaigns')
            .insert([{
                ...formData,
                status: 'draft',
                recipients: 0
            }])
            .select()
            .single()

        if (campaignError) {
            setError(campaignError.message)
            setLoading(false)
            alert('Error creating campaign: ' + campaignError.message)
            return
        }

        // Insert selected parts into junction table
        if (selectedParts.length > 0) {
            const campaignParts = selectedParts.map((partId, index) => ({
                campaign_id: campaign.id,
                part_id: partId,
                display_order: index + 1
            }))

            const { error: partsError } = await supabase
                .from('email_campaign_parts')
                .insert(campaignParts)

            if (partsError) {
                setError(partsError.message)
                setLoading(false)
                alert('Error adding products to campaign: ' + partsError.message)
                return
            }
        }

        // Success - redirect to campaigns list
        router.push('/admin/campaigns')
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Create New Campaign</h1>
                    <p className="text-gray-600 mt-2">Design your email flyer and select featured products</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSaveDraft} className="space-y-6">
                    {/* Campaign Details Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
                        
                        {/* Campaign Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Name *
                            </label>
                            <input
                                type="text"
                                name="campaign_name"
                                value={formData.campaign_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g., Spring Sale 2024"
                            />
                        </div>

                        {/* Subject Line */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Subject Line *
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g., 🚚 New Arrivals - Heavy Duty Parts"
                            />
                        </div>

                        {/* Headline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Headline Text
                            </label>
                            <textarea
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g., Check out our latest products!"
                            />
                        </div>
                    </div>

                    {/* Product Selection Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Select Products ({selectedParts.length} selected)
                        </h2>
                        
                        {parts.length === 0 ? (
                            <p className="text-gray-500">No products available. Add products first.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {parts.map((part) => (
                                    <div
                                        key={part.id}
                                        onClick={() => togglePartSelection(part.id)}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedParts.includes(part.id)
                                                ? 'border-black bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedParts.includes(part.id)}
                                                onChange={() => {}}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                {part.images && part.images[0] && (
                                                    <Image
                                                        src={part.images[0]}
                                                        alt={part.name}
                                                        width={80}
                                                        height={80}
                                                        className="w-full h-32 object-cover rounded mb-2"
                                                    />
                                                )}
                                                <h3 className="font-medium text-sm">{part.name}</h3>
                                                <p className="text-sm text-gray-600">${part.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || selectedParts.length === 0}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/campaigns')}
                            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>

                    {selectedParts.length === 0 && (
                        <p className="text-sm text-red-600">Please select at least one product for your campaign.</p>
                    )}
                </form>
            </div>
        </main>
    )
}