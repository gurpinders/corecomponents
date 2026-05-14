'use client'

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'

export default function EditTruckPage({ params }) {
    const [truckId, setTruckId] = useState(null)
    const [formData, setFormData] = useState({
        year: '', make: '', model: '', colour: '', vin: '', mileage: '',
        engine: '', transmission: '', gvw: '', truck_category: '',
        condition: 'used', description: '', features: '',
        retail_price: '', customer_price: '', status: 'available', images: ['']
    })
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [vinLookupLoading, setVinLookupLoading] = useState(false)
    const [vinLookupSuccess, setVinLookupSuccess] = useState(false)
    const [vinLookupError, setVinLookupError] = useState(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    useEffect(() => {
        const loadTruck = async () => {
            const { id } = await params
            setTruckId(id)
            await fetchTruck(id)
        }
        loadTruck()
    }, [params])

    const fetchTruck = async (id) => {
        const { data, error } = await supabase.from('trucks').select('*').eq('id', id).single()
        if (error) { setError(error.message); setLoading(false); return }
        if (data) {
            const cleanImages = (data.images || []).filter(url => url && url.trim() !== '')
            setFormData({
                year: data.year || '', make: data.make || '', model: data.model || '',
                colour: data.colour || '', vin: data.vin || '', mileage: data.mileage || '',
                engine: data.engine || '', transmission: data.transmission || '', gvw: data.gvw || '',
                truck_category: data.truck_category || '', condition: data.condition || 'used',
                description: data.description || '', features: data.features || '',
                retail_price: data.retail_price || '', customer_price: data.customer_price || '',
                status: data.status || 'available', images: data.images || ['']
            })
            setImages(cleanImages)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'retail_price') {
            setFormData({ ...formData, retail_price: value, customer_price: (parseFloat(value) * 0.95 || 0).toFixed(2) })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleVinLookup = async () => {
        if (formData.vin.length !== 17) { setVinLookupError('VIN must be exactly 17 characters'); return }
        setVinLookupLoading(true); setVinLookupError(null); setVinLookupSuccess(false)
        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${formData.vin}?format=json`)
            const data = await response.json()
            if (data.Results && data.Results[0]) {
                const result = data.Results[0]
                const updates = {}
                if (result.Make && result.Make !== 'Not Applicable') updates.make = result.Make
                if (result.Model && result.Model !== 'Not Applicable') updates.model = result.Model
                if (result.ModelYear && result.ModelYear !== 'Not Applicable') updates.year = result.ModelYear
                const engineParts = [result.EngineModel, result.DisplacementL ? result.DisplacementL + 'L' : '', result.FuelTypePrimary].filter(p => p && p !== 'Not Applicable')
                if (engineParts.length > 0) updates.engine = engineParts.join(' ')
                if (result.TransmissionStyle && result.TransmissionStyle !== 'Not Applicable') updates.transmission = result.TransmissionStyle
                if (result.GVWR && result.GVWR !== 'Not Applicable') { const m = result.GVWR.match(/(\d+)/); if (m) updates.gvw = m[1] }
                if (result.BodyCabType && result.BodyCabType !== 'Not Applicable') updates.truck_category = result.BodyCabType
                setFormData({ ...formData, ...updates })
                setVinLookupSuccess(true)
                setTimeout(() => setVinLookupSuccess(false), 3000)
            } else { setVinLookupError('Could not decode VIN. Please enter details manually.') }
        } catch (error) { setVinLookupError('VIN lookup failed. Please try again.') }
        finally { setVinLookupLoading(false) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError(null)
        const cleanImages = images.filter(url => url && url.trim() !== '')
        const truckData = { ...formData, year: parseInt(formData.year), mileage: parseInt(formData.mileage), gvw: parseInt(formData.gvw), retail_price: parseFloat(formData.retail_price), customer_price: parseFloat(formData.customer_price), images: cleanImages }
        const { error } = await supabase.from('trucks').update(truckData).eq('id', truckId)
        if (error) { setError(error.message); setSaving(false); showError('Error updating truck: ' + error.message); return }
        success('Truck updated successfully!')
        router.push('/admin/trucks')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"
    const sectionClass = "border-b border-white/10 pb-6"

    if (loading) return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <p className="text-center py-12 text-gray-400">Loading truck data...</p>
                </div>
            </main>
        </AdminProtection>
    )

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Edit Truck</h1>
                        <p className="text-gray-400 mt-2">Update the details for {formData.year} {formData.make} {formData.model}</p>
                    </div>
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}

                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">

                        {/* Basic Info */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div><label className={labelClass}>Year *</label><input type="number" name="year" value={formData.year} onChange={handleChange} required min="1980" max="2030" className={inputClass} /></div>
                                <div><label className={labelClass}>Make *</label><input type="text" name="make" value={formData.make} onChange={handleChange} required className={inputClass} /></div>
                                <div><label className={labelClass}>Model *</label><input type="text" name="model" value={formData.model} onChange={handleChange} required className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Color *</label><input type="text" name="colour" value={formData.colour} onChange={handleChange} required className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>VIN *</label>
                                    <div className="flex gap-2">
                                        <input type="text" name="vin" value={formData.vin} onChange={handleChange} required maxLength={17} className={inputClass} />
                                        <button type="button" onClick={handleVinLookup} disabled={vinLookupLoading || formData.vin.length !== 17} className="bg-navy text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-light disabled:opacity-50 whitespace-nowrap transition-colors">
                                            {vinLookupLoading ? 'Looking...' : 'Lookup'}
                                        </button>
                                    </div>
                                    {vinLookupSuccess && <p className="text-sm text-green-400 mt-1">✓ VIN lookup successful!</p>}
                                    {vinLookupError && <p className="text-sm text-red-400 mt-1">{vinLookupError}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Technical Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Mileage (miles) *</label><input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required min="0" className={inputClass} /></div>
                                <div><label className={labelClass}>GVW (lbs) *</label><input type="number" name="gvw" value={formData.gvw} onChange={handleChange} required min="0" className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Engine *</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} required className={inputClass} /></div>
                                <div><label className={labelClass}>Transmission *</label><input type="text" name="transmission" value={formData.transmission} onChange={handleChange} required className={inputClass} /></div>
                            </div>
                        </div>

                        {/* Truck Details */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Truck Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Truck Category *</label><input type="text" name="truck_category" value={formData.truck_category} onChange={handleChange} required className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>Condition *</label>
                                    <select name="condition" value={formData.condition} onChange={handleChange} required className={inputClass}>
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                        <option value="rebuilt">Rebuilt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4"><label className={labelClass}>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={inputClass} /></div>
                            <div><label className={labelClass}>Features</label><textarea name="features" value={formData.features} onChange={handleChange} rows="3" className={inputClass} /></div>
                        </div>

                        {/* Pricing */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Retail Price *</label><input type="number" name="retail_price" value={formData.retail_price} onChange={handleChange} required step="0.01" min="0" className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>Customer Price (5% off)</label>
                                    <input type="number" name="customer_price" value={formData.customer_price} onChange={handleChange} step="0.01" min="0" className={`${inputClass} opacity-70`} />
                                    <p className="text-xs text-gray-500 mt-1">Auto-calculated as 5% off retail</p>
                                </div>
                            </div>
                        </div>

                        {/* Status & Images */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">Status & Images</h2>
                            <div className="mb-4">
                                <label className={labelClass}>Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
                                    <option value="available">Available</option>
                                    <option value="pending">Pending</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>
                            <ImageUpload images={images} onImagesChange={setImages} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" disabled={saving} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                {saving ? 'Updating...' : 'Update Truck'}
                            </button>
                            <button type="button" onClick={() => router.push('/admin/trucks')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AdminProtection>
    )
}