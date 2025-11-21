'use client'

import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/CartContext'
import { useState, useEffect } from 'react'

export default function Catalog(){
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStock, setSelectedStock] = useState('all')
    const [categories, setCategories] = useState([])
    const [sortBy, setSortBy] = useState('name-asc')

    const { user } = useCart()

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            
            const { data: productsData } = await supabase.from('parts').select('*').order('name')
            const { data: categoriesData } = await supabase.from('categories').select('*').order('name')
            
            if (productsData) setProducts(productsData)
            if (categoriesData) setCategories(categoriesData)
            
            setLoading(false)
        }
        
        fetchData()
    }, [])

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
        const matchesStock = selectedStock === 'all' || product.stock_status === selectedStock
        return matchesSearch && matchesCategory && matchesStock
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name)
            case 'name-desc':
                return b.name.localeCompare(a.name)
            case 'price-asc':
                return a.retail_price - b.retail_price
            case 'price-desc':
                return b.retail_price - a.retail_price
            case 'date-newest':
                return new Date(b.created_at) - new Date(a.created_at)
            case 'date-oldest':
                return new Date(a.created_at) - new Date(b.created_at)
            default:
                return 0
        }
    })

    if (loading) {
        return (
            <div>
                <Header />
                <main className='min-h-screen bg-gray-50 py-12 flex items-center justify-center'>
                    <p className='text-xl text-gray-600'>Loading products...</p>
                </main>
                <Footer />
            </div>
        )
    }

    return(
        <div>
            <Header />
            <main className='min-h-screen bg-gray-50 py-12'>
                <div className='max-w-7xl mx-auto px-6'>
                    <h1 className='text-4xl font-bold mb-8 text-gray-900'>Parts Catalog</h1>
                    
                    {/* Login Prompt for Non-Logged-In Users */}
                    {!user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-blue-900">
                                <span className="font-medium">Sign in</span> to see exclusive customer pricing and save 5% on all parts!
                            </p>
                        </div>
                    )}

                    <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search parts..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Status
                                </label>
                                <select
                                    value={selectedStock}
                                    onChange={(e) => setSelectedStock(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="all">All Stock Levels</option>
                                    <option value="in_stock">In Stock</option>
                                    <option value="low_stock">Low Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="price-asc">Price (Low to High)</option>
                                    <option value="price-desc">Price (High to Low)</option>
                                    <option value="date-newest">Newest First</option>
                                    <option value="date-oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                        {sortedProducts?.map((product) => (
                            <Link key={product.id} href={`/catalog/${product.id}`}>
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                                    {product.images && product.images[0] ? (
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            width={400} 
                                            height={300} 
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <p className="text-gray-500">No image</p>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                                        
                                        {/* Pricing Display */}
                                        {user ? (
                                            // Logged in - show both prices
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 line-through">
                                                    ${product.retail_price}
                                                </p>
                                                <p className="text-xl font-bold text-green-600">
                                                    ${product.customer_price}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    You save ${(product.retail_price - product.customer_price).toFixed(2)}
                                                </p>
                                            </div>
                                        ) : (
                                            // Not logged in - show retail price
                                            <p className="text-xl font-semibold text-gray-900 mb-2">
                                                Starting at ${product.retail_price}
                                            </p>
                                        )}

                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                            product.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock_status === 'in_stock' ? 'In Stock' :
                                             product.stock_status === 'low_stock' ? 'Low Stock' :
                                             'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {sortedProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    )
}