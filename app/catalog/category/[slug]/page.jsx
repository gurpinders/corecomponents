import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PartsList from '@/components/PartsList'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'


export const dynamic = 'force-dynamic'

const slugMap = {
    'engines': 'Engines',
    'transmissions': 'Transmissions',
    'one-box': 'One Box',
    'ecm-electrical': 'ECM & Electrical',
    'clutch-actuators': 'Clutch Actuators',
    'body-accessories': 'Body & Accessories',
}

export default async function CategoryPage({ params }) {
    const { slug } = await params
    const categoryName = slugMap[slug]

    if (!categoryName) notFound()

    const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('name', categoryName)

    const category = categoryData?.[0] || null

    let parts = []
    if (category) {
        const { data } = await supabase
            .from('parts')
            .select('*')
            .eq('category_id', category.id)
            .order('name')
        parts = data || []
    }

    const availableCount = parts.filter(p => p.stock_status !== 'out_of_stock').length

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Category Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <Link href="/catalog" className="text-gray-400 hover:text-white text-sm mb-6 inline-block transition-colors">
                            ← Back to all categories
                        </Link>
                        <h1 className="text-5xl font-bold text-white mb-6">{categoryName}</h1>
                        <div className="inline-flex items-center gap-2 bg-navy px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white text-sm font-medium">{availableCount} items currently available</span>
                        </div>
                    </div>
                </section>

                {/* Parts List */}
                <section className="py-12 bg-black">
                    <div className="max-w-7xl mx-auto px-6">
                        {parts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-xl mb-4">No parts listed in this category yet.</p>
                                <p className="text-gray-500 mb-8">Call us directly — we may have what you need in stock.</p>
                                <a href="tel:6479938235" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                    Call (647) 993-8235
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 mb-12">
                                <PartsList parts={parts} />
                            </div>
                        )}

                        {/* Contact CTA */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Ready to order? Get in touch.</h2>
                                <p className="text-gray-400">Call or text us and we'll confirm availability, pricing, and arrange delivery or pickup.</p>
                            </div>
                            <div className="flex flex-col gap-3 flex-shrink-0">
                                <a href="tel:6479938235" className="bg-white text-black px-10 py-3 rounded-lg font-bold text-center hover:bg-gray-100 transition-colors">
                                    📞 Call (647) 993-8235
                                </a>
                                <a href="sms:6479938235" className="bg-navy text-white px-10 py-3 rounded-lg font-bold text-center hover:bg-navy-light transition-colors">
                                    💬 Text Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}