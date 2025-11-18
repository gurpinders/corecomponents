import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function ProductDetailPage({ params }) {
    const { id } = await params
    const { data: product } = await supabase.from('parts').select('*').eq('id', id).single()

    if (!product) {
        return (
            <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link href="/catalog" className="text-blue-600 hover:underline">
                    Back to Catalog
                </Link>
                </div>
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
                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-black">Home</Link>
                        {' / '}
                        <Link href="/catalog" className="hover:text-black">Catalog</Link>
                        {' / '}
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Image */}
                        <div>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    width={800} 
                                    height={600} 
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    
                        {/* Right: Details */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <p className="text-3xl font-bold text-gray-900 mb-4">Starting from ${product.price}</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                                product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                product.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {product.stock_status === 'in_stock' ? 'In Stock' : product.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                            </span>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                            <Link href={`/catalog/${product.id}/quote`} className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors">Request Quote</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}