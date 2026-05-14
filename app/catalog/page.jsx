import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const categories = [
    { name: 'Engines', desc: 'DD15, Cummins, Volvo, CAT, Paccar', slug: 'engines', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=70' },
    { name: 'Transmissions', desc: 'DT12, ATO2612F, 18 Speed Manual', slug: 'transmissions', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70' },
    { name: 'One Box', desc: 'Volvo, Cascadia, Cummins, Paccar', slug: 'one-box', img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&q=70' },
    { name: 'ECM & Electrical', desc: 'ACM, CPC, ABS modules', slug: 'ecm-electrical', img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=70' },
    { name: 'Clutch Actuators', desc: 'DT12 and I Shift actuators', slug: 'clutch-actuators', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=70' },
    { name: 'Body & Accessories', desc: 'Doors, hoods, cab accessories', slug: 'body-accessories', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=70' },
]

export default function CatalogPage() {
    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Parts Catalog</h1>
                        <p className="text-gray-400 text-lg">Select a category to see what we have in stock — then call or text us to get it.</p>
                    </div>
                </section>

                {/* Category Grid */}
                <section className="py-16 bg-black">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/catalog/category/${cat.slug}`}
                                    className="relative rounded-xl overflow-hidden h-64 block group"
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-60 transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                        <p className="text-white/80 text-sm mb-2">{cat.desc}</p>
                                        <span className="text-white/60 text-xs">View parts →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-[#0a0a0a] border-t border-white/10 py-12">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Can't find what you need?</h2>
                            <p className="text-gray-400">Call or text us directly — we source parts not listed online.</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="tel:6479938235" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Call (647) 993-8235
                            </a>
                            <a href="sms:6479938235" className="bg-navy text-white px-8 py-3 rounded-lg font-bold hover:bg-navy-light transition-colors">
                                Text Us
                            </a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}