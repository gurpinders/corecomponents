'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/CartContext'
import { useState, useEffect } from 'react'

export default function TrucksPage(){
    const [trucks, setTrucks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMake, setSelectedMake] = useState('all')
    const [selectedYear, setSelectedYear] = useState('all')
    const [sortBy, setSortBy] = useState('date-newest')
    
    const { user } = useCart()

    useEffect(() => {
        async function fetchTrucks() {
            setLoading(true)
            const { data: trucksData } = await supabase
                .from('trucks')
                .select('*')
                .eq('status', 'available')
                .order('created_at', { ascending: false })
            if (trucksData) setTrucks(trucksData)
            setLoading(false)
        }
        fetchTrucks()
    }, [])

    const uniqueMakes = ['all', ...new Set(trucks.map(truck => truck.make))]
    const years = trucks.map(t => t.year)
    const minYear = years.length > 0 ? Math.min(...years) : 2000
    const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear()

    const filteredTrucks = trucks.filter(truck => {
        const matchesSearch = 
            truck.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
            truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            truck.year.toString().includes(searchQuery)
        const matchesMake = selectedMake === 'all' || truck.make === selectedMake
        const matchesYear = selectedYear === 'all' || truck.year.toString() === selectedYear
        return matchesSearch && matchesMake && matchesYear
    })

    const sortedTrucks = [...filteredTrucks].sort((a, b) => {
        switch(sortBy) {
            case 'date-newest': return new Date(b.created_at) - new Date(a.created_at)
            case 'date-oldest': return new Date(a.created_at) - new Date(b.created_at)
            case 'price-asc': return a.retail_price - b.retail_price
            case 'price-desc': return b.retail_price - a.retail_price
            case 'mileage-asc': return a.mileage - b.mileage
            case 'mileage-desc': return b.mileage - a.mileage
            case 'year-newest': return b.year - a.year
            case 'year-oldest': return a.year - b.year
            default: return 0
        }
    })

    if (loading) {
        return (
            <div className="bg-black">
                <Header />
                <main className='min-h-screen py-12 flex items-center justify-center'>
                    <p className='text-xl text-gray-400'>Loading trucks...</p>
                </main>
                <Footer />
            </div>
        )
    }

    return(
        <div className="bg-black">
            <Header />
            <main className='min-h-screen'>

                {/* Page Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <h1 className='text-5xl font-bold text-white mb-4'>Trucks For Sale</h1>
                        <p className='text-gray-400 text-lg'>Quality heavy-duty trucks ready for work</p>
                    </div>
                </section>

                <div className='max-w-7xl mx-auto px-6 py-12'>

                    {/* Login Prompt */}
                    {!user && (
                        <div className="bg-navy/30 border border-navy text-white rounded-lg p-4 mb-8">
                            <p>
                                <span className="font-semibold">Sign in</span> to see exclusive customer pricing and save 5% on all trucks!
                            </p>
                        </div>
                    )}

                    {/* Filters */}
                    <div className='bg-white/5 border border-white/10 p-6 rounded-xl mb-8'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search make, model, year..."
                                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Make</label>
                                <select
                                    value={selectedMake}
                                    onChange={(e) => setSelectedMake(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
                                >
                                    {uniqueMakes.map(make => (
                                        <option key={make} value={make}>
                                            {make === 'all' ? 'All Makes' : make}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
                                >
                                    <option value="all">All Years</option>
                                    {Array.from({length: maxYear - minYear + 1}, (_, i) => maxYear - i).map(year => (
                                        <option key={year} value={year.toString()}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
                                >
                                    <option value="date-newest">Newest First</option>
                                    <option value="date-oldest">Oldest First</option>
                                    <option value="price-asc">Price (Low to High)</option>
                                    <option value="price-desc">Price (High to Low)</option>
                                    <option value="mileage-asc">Mileage (Low to High)</option>
                                    <option value="mileage-desc">Mileage (High to Low)</option>
                                    <option value="year-newest">Year (Newest)</option>
                                    <option value="year-oldest">Year (Oldest)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-gray-400 mb-6">
                        Showing {sortedTrucks.length} truck{sortedTrucks.length !== 1 ? 's' : ''}
                    </p>

                    {/* Trucks Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {sortedTrucks?.map((truck) => (
                            <Link key={truck.id} href={`/trucks/${truck.id}`}>
                                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/25 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                                    {truck.images && truck.images[0] ? (
                                        <Image
                                            src={truck.images[0]}
                                            alt={`${truck.year} ${truck.make} ${truck.model}`}
                                            width={400}
                                            height={300}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                                            <p className="text-gray-500">No image</p>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {truck.year} {truck.make} {truck.model}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-1">{truck.truck_category}</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {truck.mileage.toLocaleString()} miles
                                        </p>
                                        {user ? (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-500 line-through">${truck.retail_price.toLocaleString()}</p>
                                                <p className="text-2xl font-bold text-green-400">${truck.customer_price.toLocaleString()}</p>
                                                <p className="text-xs text-green-400">You save ${(truck.retail_price - truck.customer_price).toLocaleString()}</p>
                                            </div>
                                        ) : (
                                            <p className="text-2xl font-bold text-white mb-4">
                                                Starting at ${truck.retail_price.toLocaleString()}
                                            </p>
                                        )}
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-navy text-white/80 capitalize mb-4">
                                            {truck.condition}
                                        </span>
                                        <button className="w-full bg-white text-black py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition-colors mt-2">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {sortedTrucks.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg mb-4">No trucks found matching your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedMake('all'); setSelectedYear('all') }}
                                className="text-white underline hover:text-gray-300"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    )
}