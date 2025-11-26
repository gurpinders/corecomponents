'use client'

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'

export default function EditTruckPage({ params }){
    const [truckId, setTruckId] = useState(null)
    const [formData, setFormData] = useState({
        year: '',
        make: '',
        model: '',
        colour: '',
        vin: '',
        mileage: '',
        engine: '',
        transmission: '',
        gvw: '',
        truck_category: '',
        condition: 'used',
        description: '',
        features: '',
        retail_price: '',
        customer_price: '',
        status: 'available',
        images: ['']
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
        const { data, error } = await supabase
            .from('trucks')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (data) {
            // Clean images array
            const cleanImages = (data.images || []).filter(url => url && url.trim() !== '')
            
            // Pre-fill form with existing data
            setFormData({
                year: data.year || '',
                make: data.make || '',
                model: data.model || '',
                colour: data.colour || '',
                vin: data.vin || '',
                mileage: data.mileage || '',
                engine: data.engine || '',
                transmission: data.transmission || '',
                gvw: data.gvw || '',
                truck_category: data.truck_category || '',
                condition: data.condition || 'used',
                description: data.description || '',
                features: data.features || '',
                retail_price: data.retail_price || '',
                customer_price: data.customer_price || '',
                status: data.status || 'available',
                images: data.images || ['']
            })
            setImages(cleanImages)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        // Auto-calculate customer price when retail price changes
        if (name === 'retail_price') {
            const retailPrice = parseFloat(value) || 0
            const customerPrice = (retailPrice * 0.95).toFixed(2)
            setFormData({
                ...formData,
                retail_price: value,
                customer_price: customerPrice,
                
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const handleVinLookup = async () => {
        if (formData.vin.length !== 17) {
            setVinLookupError('VIN must be exactly 17 characters')
            return
        }

        setVinLookupLoading(true)
        setVinLookupError(null)
        setVinLookupSuccess(false)

        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${formData.vin}?format=json`)
            const data = await response.json()

            if (data.Results && data.Results[0]) {
                const result = data.Results[0]

                // Only update fields that have valid data
                const updates = {}
                
                if (result.Make && result.Make !== 'Not Applicable') updates.make = result.Make
                if (result.Model && result.Model !== 'Not Applicable') updates.model = result.Model
                if (result.ModelYear && result.ModelYear !== 'Not Applicable') updates.year = result.ModelYear
                
                // Engine info
                if (result.EngineModel || result.DisplacementL || result.FuelTypePrimary) {
                    const engineParts = []
                    if (result.EngineModel && result.EngineModel !== 'Not Applicable') engineParts.push(result.EngineModel)
                    if (result.DisplacementL && result.DisplacementL !== 'Not Applicable') engineParts.push(`${result.DisplacementL}L`)
                    if (result.FuelTypePrimary && result.FuelTypePrimary !== 'Not Applicable') engineParts.push(result.FuelTypePrimary)
                    if (engineParts.length > 0) updates.engine = engineParts.join(' ')
                }

                // Transmission
                if (result.TransmissionStyle && result.TransmissionStyle !== 'Not Applicable') {
                    updates.transmission = result.TransmissionStyle
                }

                // GVW
                if (result.GVWR && result.GVWR !== 'Not Applicable') {
                    const gvwMatch = result.GVWR.match(/(\d+)/)
                    if (gvwMatch) updates.gvw = gvwMatch[1]
                }

                // Truck Category
                if (result.BodyCabType && result.BodyCabType !== 'Not Applicable') {
                    updates.truck_category = result.BodyCabType
                }

                setFormData({ ...formData, ...updates })
                setVinLookupSuccess(true)
                
                setTimeout(() => setVinLookupSuccess(false), 3000)
            } else {
                setVinLookupError('Could not decode VIN. Please enter details manually.')
            }
        } catch (error) {
            console.error('VIN lookup error:', error)
            setVinLookupError('VIN lookup failed. Please try again.')
        } finally {
            setVinLookupLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        // Clean images array
        const cleanImages = images.filter(url => url && url.trim() !== '')

        // Convert string numbers to actual numbers
        const truckData = {
            ...formData,
            year: parseInt(formData.year),
            mileage: parseInt(formData.mileage),
            gvw: parseInt(formData.gvw),
            retail_price: parseFloat(formData.retail_price),
            customer_price: parseFloat(formData.customer_price),
            images: cleanImages
        }

        const { error } = await supabase
            .from('trucks')
            .update(truckData)
            .eq('id', truckId)

        if (error) {
            setError(error.message)
            setSaving(false)
            showError('Error updating truck: ' + error.message)
            return
        }

        // Success - redirect to trucks list
        success('Truck updated successfully!')
        router.push('/admin/trucks')
    }

    if (loading) {
        return (
            <AdminProtection>
                <main className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-3xl mx-auto px-6">
                        <p className="text-center py-12">Loading truck data...</p>
                    </div>
                </main>
            </AdminProtection>
        )
    }

    if (error && !formData.make) {
        return (
            <AdminProtection>
                <main className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            Error: {error}
                        </div>
                        <button
                            onClick={() => router.push('/admin/trucks')}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
                        >
                            Back to Trucks
                        </button>
                    </div>
                </main>
            </AdminProtection>
        )
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Truck</h1>
                    <p className="text-gray-600 mt-2">Update the details for {formData.year} {formData.make} {formData.model}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    
                    {/* Basic Info Section */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year *
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    min="1980"
                                    max="2030"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="2021"
                                />
                            </div>

                            {/* Make */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Make *
                                </label>
                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Freightliner"
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Cascadia"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color *
                                </label>
                                <input
                                    type="text"
                                    name="colour"
                                    value={formData.colour}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="White"
                                />
                            </div>

                            {/* VIN with Lookup */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    VIN *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="vin"
                                        value={formData.vin}
                                        onChange={handleChange}
                                        required
                                        maxLength={17}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="1FUJGHDV8CLHXXXXXX"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVinLookup}
                                        disabled={vinLookupLoading || formData.vin.length !== 17}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {vinLookupLoading ? 'Looking up...' : 'Lookup VIN'}
                                    </button>
                                </div>
                                {vinLookupSuccess && (
                                    <p className="text-sm text-green-600 mt-1">✓ VIN lookup successful!</p>
                                )}
                                {vinLookupError && (
                                    <p className="text-sm text-red-600 mt-1">{vinLookupError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs Section */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Mileage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mileage (miles) *
                                </label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="450000"
                                />
                            </div>

                            {/* GVW */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GVW (lbs) *
                                </label>
                                <input
                                    type="number"
                                    name="gvw"
                                    value={formData.gvw}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="52000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Engine */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Engine *
                                </label>
                                <input
                                    type="text"
                                    name="engine"
                                    value={formData.engine}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Detroit DD15 455HP"
                                />
                            </div>

                            {/* Transmission */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transmission *
                                </label>
                                <input
                                    type="text"
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Manual 13 Speed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Truck Details Section */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-4">Truck Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Truck Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Truck Category *
                                </label>
                                <input
                                    type="text"
                                    name="truck_category"
                                    value={formData.truck_category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Day Cab, Sleeper, Dump Truck, etc."
                                />
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="rebuilt">Rebuilt</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Full description of the truck, history, condition details..."
                            />
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Features
                            </label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Air ride suspension, APU, leather seats, chrome bumper..."
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-4">Pricing</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Retail Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Retail Price *
                                </label>
                                <input
                                    type="number"
                                    name="retail_price"
                                    value={formData.retail_price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="45000.00"
                                />
                            </div>

                            {/* Customer Price (Auto-calculated) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Price (5% off)
                                </label>
                                <input
                                    type="number"
                                    name="customer_price"
                                    value={formData.customer_price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Auto-calculated"
                                />
                                <p className="text-xs text-gray-500 mt-1">Automatically calculated as 5% off retail</p>
                            </div>
                        </div>
                    </div>

                    {/* Status & Images Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Status & Images</h2>
                        
                        {/* Status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <ImageUpload 
                        images={images}
                        onImagesChange={setImages}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Updating...' : 'Update Truck'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/trucks')}
                            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
        </AdminProtection>

    )
}