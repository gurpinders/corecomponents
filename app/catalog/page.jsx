'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useToast } from '@/lib/ToastContext'

function CatalogContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, addToCart } = useCart()
    
    const categoryId = searchParams.get('category')
    const searchQuery = searchParams.get('search')
    
    const [categories, setCategories] = useState([])
    const [parts, setParts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(searchQuery || '')
    const { success } = useToast()

    // Update search input when URL search query changes
    useEffect(() => {
        setSearch(searchQuery || '')
    }, [searchQuery])

    // Fetch data when category or search changes
    useEffect(() => {
        if (categoryId) {
            fetchCategoryAndParts()
        } else {
            fetchCategories()
        }
    }, [categoryId, searchQuery])

    const fetchCategories = async () => {
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('display_order')

        if (data) {
            setCategories(data)
        }
        setLoading(false)
    }

    const fetchCategoryAndParts = async () => {
        setLoading(true)

        // Fetch selected category
        const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single()

        if (categoryData) {
            setSelectedCategory(categoryData)
        }

        // Fetch ALL parts in this category first
        const { data: allParts } = await supabase
            .from('parts')
            .select('*')
            .eq('category_id', categoryId)
            .order('name')

        // If there's a search query, filter client-side
        if (searchQuery && searchQuery.trim() && allParts) {
            const searchLower = searchQuery.toLowerCase().trim()
            const filteredParts = allParts.filter(part => {
                return (
                    part.name?.toLowerCase().includes(searchLower) ||
                    part.description?.toLowerCase().includes(searchLower) ||
                    part.sku?.toLowerCase().includes(searchLower)
                )
            })
            setParts(filteredParts)
        } else {
            setParts(allParts || [])
        }

        setLoading(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (categoryId) {
            if (search.trim()) {
                router.push(`/catalog?category=${categoryId}&search=${encodeURIComponent(search)}`)
            } else {
                // If search is empty, remove search param
                router.push(`/catalog?category=${categoryId}`)
            }
        }
    }

    const handleClearSearch = () => {
        setSearch('')
        router.push(`/catalog?category=${categoryId}`)
    }

    const handleAddToCart = (part) => {
        const cartItem = {
            ...part,
            price: user ? part.customer_price : part.retail_price
        }
        addToCart(cartItem, 1)
        success(`${part.name} added to cart!`)
    }

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading...</p>
                </main>
                <Footer />
            </div>
        )
    }

    // CATEGORY GRID VIEW
    if (!categoryId) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-2">Browse Parts by Category</h1>
                            <p className="text-gray-600">Select a category to view available parts</p>
                        </div>

                        {/* Category Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/catalog?category=${category.id}`}
                                    className="relative h-[300px] rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    {/* Category Image */}
                                    <div className="absolute inset-0">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                                                <div className="text-8xl opacity-30">🔧</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-white/90 mb-3 line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}
                                        <div className="flex items-center text-yellow-400 font-semibold">
                                            <span>Browse Parts</span>
                                            <svg 
                                                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // PARTS LIST VIEW (when category is selected)
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="mb-6 flex items-center text-sm text-gray-600">
                        <Link href="/catalog" className="hover:text-black">
                            All Categories
                        </Link>
                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-black font-medium">{selectedCategory?.name}</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">{selectedCategory?.name}</h1>
                        {selectedCategory?.description && (
                            <p className="text-gray-600">{selectedCategory.description}</p>
                        )}
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search parts in this category..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 whitespace-nowrap"
                            >
                                Search
                            </button>
                            {(search || searchQuery) && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 whitespace-nowrap"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Search Results Info */}
                    {searchQuery && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800">
                                Searching for: <span className="font-bold">"{searchQuery}"</span>
                                {' '}- Found {parts.length} {parts.length === 1 ? 'result' : 'results'}
                            </p>
                        </div>
                    )}

                    {/* Parts Count */}
                    {!searchQuery && (
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {parts.length} {parts.length === 1 ? 'part' : 'parts'} found
                            </p>
                        </div>
                    )}

                    {/* Parts Grid */}
                    {parts.length === 0 ? (
                        <div className="text-center py-12">
                            {searchQuery ? (
                                <>
                                    <p className="text-xl text-gray-500 mb-4">
                                        No parts found matching "{searchQuery}"
                                    </p>
                                    <button
                                        onClick={handleClearSearch}
                                        className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 mr-4"
                                    >
                                        Clear Search
                                    </button>
                                </>
                            ) : (
                                <p className="text-xl text-gray-500 mb-4">No parts found in this category</p>
                            )}
                            <Link
                                href="/catalog"
                                className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
                            >
                                ← Back to Categories
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {parts.map((part) => (
                                <div key={part.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Part Image */}
                                    <Link href={`/catalog/${part.id}`}>
                                        <div className="relative w-full h-48 bg-gray-100">
                                            {part.images && part.images[0] ? (
                                                <Image
                                                    src={part.images[0]}
                                                    alt={part.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Part Info */}
                                    <div className="p-6">
                                        <Link href={`/catalog/${part.id}`}>
                                            <h3 className="text-lg font-bold mb-2 hover:text-blue-600">
                                                {part.name}
                                            </h3>
                                        </Link>

                                        {part.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {part.description}
                                            </p>
                                        )}

                                        {/* Stock Status */}
                                        <div className="mb-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                part.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                                part.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {part.stock_status === 'in_stock' ? 'In Stock' :
                                                 part.stock_status === 'low_stock' ? 'Low Stock' :
                                                 'Out of Stock'}
                                            </span>
                                        </div>

                                        {/* Pricing */}
                                        <div className="mb-4">
                                            {user ? (
                                                <div>
                                                    <p className="text-sm text-gray-500 line-through">${part.retail_price}</p>
                                                    <p className="text-2xl font-bold text-green-600">${part.customer_price}</p>
                                                    <p className="text-xs text-green-600">You save ${(part.retail_price - part.customer_price).toFixed(2)}</p>
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold">${part.retail_price}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(part)}
                                                disabled={part.stock_status === 'out_of_stock'}
                                                className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >
                                                Add to Cart
                                            </button>
                                            <Link
                                                href={`/catalog/${part.id}`}
                                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

// Suspense wrapper for deployment
export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading...</p>
                </main>
                <Footer />
            </div>
        }>
            <CatalogContent />
        </Suspense>
    )
}