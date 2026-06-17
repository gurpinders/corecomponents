'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'
import { generateFlyerPages } from '@/lib/flyerTemplate'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function NewCampaignPage() {
    const [parts, setParts] = useState([])
    const [trucks, setTrucks] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedParts, setSelectedParts] = useState([])
    const [selectedTrucks, setSelectedTrucks] = useState([])
    const [subject, setSubject] = useState('')
    const [promoMessage, setPromoMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [generatingPDF, setGeneratingPDF] = useState(false)
    const [recipientCount, setRecipientCount] = useState(0)
    const pdfRef = useRef(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    useEffect(() => {
        fetchParts()
        fetchTrucks()
        fetchCategories()
        fetchRecipientCount()
    }, [])

    const fetchParts = async () => {
        const { data } = await supabase.from('parts').select('*').order('name')
        if (data) setParts(data)
    }

    const fetchTrucks = async () => {
        const { data } = await supabase.from('trucks').select('*').order('year')
        if (data) setTrucks(data)
    }

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*')
        if (data) setCategories(data)
    }

    const fetchRecipientCount = async () => {
        const emailSet = new Set()
        const { data: customers } = await supabase.from('customers').select('email')
        if (customers) customers.forEach(c => { if (c.email) emailSet.add(c.email.toLowerCase()) })
        const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email').eq('active', true)
        if (subscribers) subscribers.forEach(s => { if (s.email) emailSet.add(s.email.toLowerCase()) })
        setRecipientCount(emailSet.size)
    }

    const togglePart = (id) => {
        setSelectedParts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const toggleTruck = (id) => {
        setSelectedTrucks(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const saveDraft = async () => {
        if (!subject || !promoMessage) { showError('Please fill in subject and message'); return }
        setLoading(true)
        const { error } = await supabase.from('email_campaigns').insert([{
            campaign_name: subject,
            subject: subject,
            headline: promoMessage,
            status: 'draft',
            recipients: 0
        }])
        if (error) { showError('Failed to save draft'); setLoading(false); return }
        success('Draft saved!')
        setLoading(false)
        router.push('/admin/campaigns')
    }

    const sendNow = async () => {
        if (!subject || !promoMessage) { showError('Please fill in subject and message'); return }
        if (selectedParts.length === 0 && selectedTrucks.length === 0) { showError('Please select at least one part or truck'); return }
        setSending(true)

        const { data: campaign, error: campaignError } = await supabase
            .from('email_campaigns')
            .insert([{
                campaign_name: subject,
                subject: subject,
                headline: promoMessage,
                status: 'draft',
                recipients: 0
            }])
            .select()
            .single()

        if (campaignError) { showError('Failed to create campaign'); setSending(false); return }

        const response = await fetch('/api/send-campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                campaignId: campaign.id,
                subject,
                promoMessage,
                partIds: selectedParts,
                truckIds: selectedTrucks,
            })
        })

        const result = await response.json()

        if (result.success) {
            success(`Campaign sent to ${result.totalSent} recipients!`)
            router.push('/admin/campaigns')
        } else {
            showError('Send failed: ' + result.error)
        }

        setSending(false)
    }

    const downloadPDF = async () => {
        if (!promoMessage) { showError('Please add a promotional message first'); return }
        if (selectedParts.length === 0) { showError('Please select at least one part'); return }

        setGeneratingPDF(true)

        try {
            const featuredParts = parts.filter(p => selectedParts.includes(p.id))

            const categoryMap = {}
            categories.forEach(cat => { categoryMap[cat.id] = cat.name })

            const groupedByCategory = {}
            featuredParts.forEach(part => {
                const catName = categoryMap[part.category_id] || 'Other'
                if (!groupedByCategory[catName]) groupedByCategory[catName] = []
                groupedByCategory[catName].push(part)
            })

            const categorizedParts = Object.entries(groupedByCategory).map(([categoryName, parts]) => ({
                categoryName,
                parts
            }))

            const pagesHTML = generateFlyerPages({ promoMessage, categorizedParts })

            const PAGE_WIDTH = 816
            const PAGE_HEIGHT = 1056
            const scale = 2

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [PAGE_WIDTH, PAGE_HEIGHT]
            })

            for (let i = 0; i < pagesHTML.length; i++) {
                pdfRef.current.innerHTML = pagesHTML[i]

                const images = pdfRef.current.querySelectorAll('img')
                await Promise.all(Array.from(images).map(img => {
                    if (img.complete) return Promise.resolve()
                    return new Promise(resolve => {
                        img.onload = resolve
                        img.onerror = resolve
                    })
                }))

                await new Promise(resolve => setTimeout(resolve, 200))

                const canvas = await html2canvas(pdfRef.current, {
                    backgroundColor: '#0a0a0a',
                    scale,
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    useCORS: true,
                })

                if (i > 0) {
                    pdf.addPage()
                }

                pdf.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT)
            }

            pdf.save(`corecomponents-flyer-${Date.now()}.pdf`)
        } catch (err) {
            showError('Failed to generate PDF')
        }

        setGeneratingPDF(false)
    }

    const inputClass = "w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const cardClass = "bg-white/5 border border-white/10 rounded-xl p-6"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">New Email Campaign</h1>
                        <p className="text-gray-400 mt-2">
                            Sending to <span className="text-white font-semibold">{recipientCount} recipients</span> (customers + subscribers)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left — Form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Subject */}
                            <div className={cardClass}>
                                <h2 className="text-lg font-bold text-white mb-4">Email Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Subject Line</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={e => setSubject(e.target.value)}
                                            placeholder="e.g. This Week at CoreComponents — DD15 Engines + More"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Promotional Message</label>
                                        <textarea
                                            value={promoMessage}
                                            onChange={e => setPromoMessage(e.target.value)}
                                            placeholder="e.g. This week's inventory is ready for same-day dispatch across the GTA. Call us for pricing and availability."
                                            rows={3}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Parts Selection */}
                            <div className={cardClass}>
                                <h2 className="text-lg font-bold text-white mb-2">Select Parts to Feature</h2>
                                <p className="text-gray-500 text-sm mb-4">{selectedParts.length} selected</p>
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {parts.map(part => (
                                        <label key={part.id} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedParts.includes(part.id) ? 'bg-white/10 border border-white/20' : 'bg-white/3 border border-white/5 hover:bg-white/8'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedParts.includes(part.id)}
                                                onChange={() => togglePart(part.id)}
                                                className="w-4 h-4 accent-white"
                                            />
                                            {part.images && part.images[0] && (
                                                <img src={part.images[0]} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{part.name}</p>
                                                <p className="text-gray-500 text-xs truncate">{part.description}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                                part.stock_status === 'in_stock' ? 'bg-green-900/50 text-green-400' :
                                                part.stock_status === 'low_stock' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                            }`}>
                                                {part.stock_status === 'in_stock' ? 'In Stock' : part.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Trucks Selection */}
                            {trucks.length > 0 && (
                                <div className={cardClass}>
                                    <h2 className="text-lg font-bold text-white mb-2">Select Trucks to Feature</h2>
                                    <p className="text-gray-500 text-sm mb-4">{selectedTrucks.length} selected</p>
                                    <div className="space-y-2">
                                        {trucks.map(truck => (
                                            <label key={truck.id} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedTrucks.includes(truck.id) ? 'bg-white/10 border border-white/20' : 'bg-white/3 border border-white/5 hover:bg-white/8'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTrucks.includes(truck.id)}
                                                    onChange={() => toggleTruck(truck.id)}
                                                    className="w-4 h-4 accent-white"
                                                />
                                                {truck.images && truck.images[0] && (
                                                    <img src={truck.images[0]} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium">{truck.year} {truck.make} {truck.model}</p>
                                                    <p className="text-gray-500 text-xs">{truck.engine}</p>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-900/50 text-green-400">Available</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right — Actions */}
                        <div className="space-y-6">
                            <div className={cardClass}>
                                <h2 className="text-lg font-bold text-white mb-4">Send Campaign</h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={sendNow}
                                        disabled={sending}
                                        className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        {sending ? 'Sending...' : `📤 Send Now to ${recipientCount} People`}
                                    </button>
                                    <button
                                        onClick={saveDraft}
                                        disabled={loading}
                                        className="w-full bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 disabled:opacity-50 transition-colors"
                                    >
                                        {loading ? 'Saving...' : '💾 Save as Draft'}
                                    </button>
                                    <button
                                        onClick={downloadPDF}
                                        disabled={generatingPDF}
                                        className="w-full bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 disabled:opacity-50 transition-colors"
                                    >
                                        {generatingPDF ? 'Generating PDF...' : '📄 Download as PDF'}
                                    </button>
                                    <button
                                        onClick={() => router.push('/admin/campaigns')}
                                        className="w-full bg-transparent text-gray-400 py-3 rounded-lg font-medium hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className={cardClass}>
                                <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Tips</h2>
                                <div className="space-y-3 text-sm text-gray-500">
                                    <p>📅 Best day to send: <span className="text-white">Wednesday</span></p>
                                    <p>🕖 Best time: <span className="text-white">7PM EST</span></p>
                                    <p>✅ Keep subject line specific — mention actual part names</p>
                                    <p>📸 Parts with photos get better engagement</p>
                                    <p>🎯 Feature 4-6 parts max per email</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden container used only to render flyer pages for PDF capture */}
            <div ref={pdfRef} style={{ position: 'fixed', top: 0, left: '-9999px', width: '816px' }}></div>
        </AdminProtection>
    )
}