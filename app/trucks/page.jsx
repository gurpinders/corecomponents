'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TrucksPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-4">Trucks For Sale</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Quality heavy-duty trucks and equipment
                    </p>

                    {/* Coming Soon Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-8">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">
                            🚚 Truck Inventory Coming Soon!
                        </h2>
                        <p className="text-blue-800 mb-6">
                            We're currently updating our truck inventory. In the meantime, call us for available trucks and equipment.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a 
                                href="tel:905-XXX-XXXX" 
                                className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800"
                            >
                                📞 Call for Inventory
                            </a>
                            <Link 
                                href="/contact" 
                                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    {/* What We Offer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-3">🚛 Heavy-Duty Trucks</h3>
                            <p className="text-gray-600">
                                Class 8 trucks from major manufacturers - Freightliner, Kenworth, Peterbilt, Volvo, and more
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-3">🚐 Vans & Medium Duty</h3>
                            <p className="text-gray-600">
                                Cargo vans, box trucks, and medium-duty commercial vehicles for your business needs
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-3">🏗️ Equipment</h3>
                            <p className="text-gray-600">
                                Construction equipment, trailers, and specialty vehicles - inspected and ready to work
                            </p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-6">Why Buy From CoreComponents?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-3">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <h4 className="font-bold mb-1">Thoroughly Inspected</h4>
                                    <p className="text-gray-600">Every truck undergoes comprehensive inspection</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <h4 className="font-bold mb-1">Competitive Pricing</h4>
                                    <p className="text-gray-600">Best prices in the GTA with transparent pricing</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <h4 className="font-bold mb-1">Financing Available</h4>
                                    <p className="text-gray-600">Flexible financing options for qualified buyers</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <h4 className="font-bold mb-1">Parts & Service</h4>
                                    <p className="text-gray-600">Full parts inventory and service support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}