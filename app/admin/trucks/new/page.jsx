'use client'

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'

export default function AddTruckPage() {
    const [formData, setFormData] = useState({
        year: '', make: '', model: '', colour: '', vin: '', mileage: '',
        engine: '', transmission: '', gvw: '', truck_category: '',
        condition: 'used', description: '', features: '',
        retail_price: '', customer_price: '', status: 'available', images: ['']
    })
    const [images, setImages] = useState([])
    const [vinLookupLoading, setVinLookupLoading] = useState(false)
    const [vinLookupError, setVinLookupError] = useState(null)
    const [vinLookupSuccess, setVinLookupSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    const handleVinLookup = async () => {
        if (!formData.vin || formData.vin.length !== 17) { setVinLookupError('Please enter a valid 17-character VIN'); return }
        setVinLookupLoading(true); setVinLookupError(null); setVinLookupSuccess(false)
        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${formData.vin}?format=json`)
            const data = await response.json()
            if (data.Results && data.Results[0]) {
                const result = data.Results[0]
                if (!result.Make || result.Make === '' || result.Make === 'Not Applicable') { setVinLookupError('No vehicle data found for this VIN'); setVinLookupLoading(false); return }
                setFormData({ ...formData,
                    make: result.Make || formData.make, model: result.Model || formData.model,
                    year: result.ModelYear || formData.year,
                    engine: result.EngineModel ? `${result.EngineModel} ${result.DisplacementL ? result.DisplacementL + 'L' : ''} ${result.FuelTypePrimary || ''}`.trim() : formData.engine,
                    transmission: result.TransmissionStyle || formData.transmission,
                    gvw: result.GVWR ? result.GVWR.replace(/[^0-9]/g, '') : formData.gvw,
                    truck_category: result.BodyClass || formData.truck_category
                })
                setVinLookupSuccess(true)
                setTimeout(() => setVinLookupSuccess(false), 3000)
            } else { setVinLookupError('No data found for this VIN') }
        } catch (err) { setVinLookupError('Failed to lookup VIN. Please try again.') }
        finally { setVinLookupLoading(false) }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'retail_price') {
            setFormData({ ...formData, retail_price: value, customer_price: (parseFloat(value) * 0.95 || 0).toFixed(2) })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(null)
        const truckData = { ...formData, year: parseInt(formData.year), mileage: parseInt(formData.mileage), gvw: parseInt(formData.gvw), retail_price: parseFloat(formData.retail_price), customer_price: parseFloat(formData.customer_price), images }
        const { error } = await supabase.from('trucks').insert([truckData])
        if (error) { setError(error.message); setLoading(false); showError('Error creating truck: ' + error.message); return }
        success('Truck created successfully!')
        router.push('/admin/trucks')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"
    const sectionClass = "border-b border-white/10 pb-6"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Add New Truck</h1>
                        <p className="text-gray-400 mt-2">Fill in the details to add a new truck to your inventory</p>
                    </div>
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}

                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">

                        {/* Basic Info */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div><label className={labelClass}>Year *</label><input type="number" name="year" value={formData.year} onChange={handleChange} required min="1980" max="2030" placeholder="2021" className={inputClass} /></div>
                                <div><label className={labelClass}>Make *</label><input type="text" name="make" value={formData.make} onChange={handleChange} required placeholder="Freightliner" className={inputClass} /></div>
                                <div><label className={labelClass}>Model *</label><input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="Cascadia" className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Color *</label><input type="text" name="colour" value={formData.colour} onChange={handleChange} required placeholder="White" className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>VIN *</label>
                                    <div className="flex gap-2">
                                        <input type="text" name="vin" value={formData.vin} onChange={handleChange} required maxLength="17" placeholder="17-character VIN" className={inputClass} />
                                        <button type="button" onClick={handleVinLookup} disabled={vinLookupLoading || !formData.vin || formData.vin.length !== 17} className="bg-navy text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-light disabled:opacity-50 whitespace-nowrap transition-colors">
                                            {vinLookupLoading ? 'Looking...' : 'Lookup'}
                                        </button>
                                    </div>
                                    {vinLookupError && <p className="text-sm text-red-400 mt-1">{vinLookupError}</p>}
                                    {vinLookupSuccess && <p className="text-sm text-green-400 mt-1">✓ VIN data loaded!</p>}
                                </div>
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Technical Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Mileage (miles) *</label><input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required min="0" placeholder="450000" className={inputClass} /></div>
                                <div><label className={labelClass}>GVW (lbs) *</label><input type="number" name="gvw" value={formData.gvw} onChange={handleChange} required min="0" placeholder="52000" className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Engine *</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} required placeholder="Detroit DD15 455HP" className={inputClass} /></div>
                                <div><label className={labelClass}>Transmission *</label><input type="text" name="transmission" value={formData.transmission} onChange={handleChange} required placeholder="Manual 13 Speed" className={inputClass} /></div>
                            </div>
                        </div>

                        {/* Truck Details */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Truck Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Truck Category *</label><input type="text" name="truck_category" value={formData.truck_category} onChange={handleChange} required placeholder="Day Cab, Sleeper, etc." className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>Condition *</label>
                                    <select name="condition" value={formData.condition} onChange={handleChange} required className={inputClass}>
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                        <option value="rebuilt">Rebuilt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4"><label className={labelClass}>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Full description of the truck..." className={inputClass} /></div>
                            <div><label className={labelClass}>Features</label><textarea name="features" value={formData.features} onChange={handleChange} rows="3" placeholder="Air ride suspension, APU, etc." className={inputClass} /></div>
                        </div>

                        {/* Pricing */}
                        <div className={sectionClass}>
                            <h2 className="text-xl font-bold text-white mb-4">Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Retail Price *</label><input type="number" name="retail_price" value={formData.retail_price} onChange={handleChange} required step="0.01" min="0" placeholder="45000.00" className={inputClass} /></div>
                                <div>
                                    <label className={labelClass}>Customer Price (5% off)</label>
                                    <input type="number" name="customer_price" value={formData.customer_price} onChange={handleChange} step="0.01" min="0" placeholder="Auto-calculated" className={`${inputClass} opacity-70`} />
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
                            <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                {loading ? 'Adding Truck...' : 'Add Truck'}
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