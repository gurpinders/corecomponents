import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
    title: 'About Us | CoreComponents',
    description: 'Learn about CoreComponents - Your trusted source for heavy-duty truck parts in Brampton, Ontario since 2020'
}

export default function AboutPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">About CoreComponents</h1>
                        <p className="text-xl text-gray-600">Your trusted partner for heavy-duty truck parts since 2020</p>
                    </div>

                    {/* Our Story */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Founded in 2020, CoreComponents has quickly become a trusted name in the heavy-duty truck parts industry. 
                            Based in Brampton, Ontario, we serve fleet owners, independent operators, and repair shops across Canada.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Our mission is simple: provide quality parts at competitive prices with exceptional customer service. 
                            We understand that downtime costs money, which is why we maintain a large inventory and offer fast shipping 
                            across the Greater Toronto Area and beyond.
                        </p>
                    </div>

                    {/* What We Offer */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-black mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Extensive Parts Inventory</h3>
                                    <p className="text-gray-600 text-sm">Engine components, brake systems, transmissions, electrical parts, and more for all major truck brands</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-black mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Complete Trucks</h3>
                                    <p className="text-gray-600 text-sm">Quality used heavy-duty trucks from Freightliner, Peterbilt, Kenworth, International, and more</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-black mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Competitive Pricing</h3>
                                    <p className="text-gray-600 text-sm">Register for an account and save 5% on all parts purchases</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-black mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Fast Delivery</h3>
                                    <p className="text-gray-600 text-sm">Free shipping in the GTA, same-day dispatch on in-stock items</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Why Choose CoreComponents?</h2>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Expert knowledge of heavy-duty truck parts and compatibility
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Quality guaranteed - we stand behind every part we sell
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Responsive customer service - we're here to help
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Convenient online ordering with secure checkout
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Serving commercial fleets and independent operators
                            </li>
                        </ul>
                    </div>

                    {/* Location & Contact */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-4">Visit or Contact Us</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-black mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Location</h3>
                                    <p className="text-gray-600">Brampton, Ontario, Canada</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-black mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Phone</h3>
                                    <a href="tel:6479938235" className="text-blue-600 hover:underline">(647) 993-8235</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-black mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Email</h3>
                                    <a href="mailto:info@ccomponents.ca" className="text-blue-600 hover:underline">info@ccomponents.ca</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-black mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <div>
                                    <h3 className="font-bold mb-1">Website</h3>
                                    <a href="https://ccomponents.ca" className="text-blue-600 hover:underline">ccomponents.ca</a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link 
                                href="/contact" 
                                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}