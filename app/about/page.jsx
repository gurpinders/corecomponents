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
                                <span className="text-2xl mr-4">🔧</span>
                                <div>
                                    <h3 className="font-bold mb-1">Extensive Parts Inventory</h3>
                                    <p className="text-gray-600 text-sm">Engine components, brake systems, transmissions, electrical parts, and more for all major truck brands</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-2xl mr-4">🚚</span>
                                <div>
                                    <h3 className="font-bold mb-1">Complete Trucks</h3>
                                    <p className="text-gray-600 text-sm">Quality used heavy-duty trucks from Freightliner, Peterbilt, Kenworth, International, and more</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-2xl mr-4">💰</span>
                                <div>
                                    <h3 className="font-bold mb-1">Competitive Pricing</h3>
                                    <p className="text-gray-600 text-sm">Register for an account and save 5% on all parts purchases</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-2xl mr-4">📦</span>
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
                            <div>
                                <h3 className="font-bold mb-1">📍 Location</h3>
                                <p className="text-gray-600">Brampton, Ontario, Canada</p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">📞 Phone</h3>
                                <a href="tel:6479938235" className="text-blue-600 hover:underline">(647) 993-8235</a>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">📧 Email</h3>
                                <a href="mailto:info@ccomponents.ca" className="text-blue-600 hover:underline">info@ccomponents.ca</a>
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">🌐 Website</h3>
                                <a href="https://ccomponents.ca" className="text-blue-600 hover:underline">ccomponents.ca</a>
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