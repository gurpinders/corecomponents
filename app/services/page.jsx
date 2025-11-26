import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
    title: 'Our Services | CoreComponents',
    description: 'Professional truck repair and parts services in Brampton, Ontario'
}

export default function ServicesPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
                        <p className="text-xl text-gray-600">Professional truck repair and parts services</p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Link href="/request-part" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-4">🔧</div>
                            <h3 className="text-xl font-bold mb-2">Request a Part</h3>
                            <p className="text-gray-600 text-sm">Can't find what you need? Let us source it for you.</p>
                        </Link>

                        <Link href="/shipping" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-4">🚚</div>
                            <h3 className="text-xl font-bold mb-2">Shipping Info</h3>
                            <p className="text-gray-600 text-sm">Fast delivery across the GTA and beyond.</p>
                        </Link>

                        <Link href="/warranty" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-4">✓</div>
                            <h3 className="text-xl font-bold mb-2">Warranty & Returns</h3>
                            <p className="text-gray-600 text-sm">Quality guaranteed with our warranty program.</p>
                        </Link>
                    </div>

                    {/* Custom Job Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Need Truck Repair or Custom Work?</h2>
                        <p className="text-xl mb-6">
                            Whether it's a major repair, custom modification, or specialized service, our experienced team is here to help.
                        </p>
                        <div className="space-y-4">
                            <p className="text-2xl font-bold">📞 Call Us Directly</p>
                            <a 
                                href="tel:6479938235" 
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                (647) 993-8235
                            </a>
                            <p className="text-sm opacity-90 mt-4">
                                Available Monday - Friday, 8 AM - 6 PM EST<br/>
                                Saturday 9 AM - 4 PM EST
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-white rounded-lg shadow p-8">
                        <h3 className="text-2xl font-bold mb-4">Why Choose CoreComponents?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold mb-2">✓ Expert Technicians</h4>
                                <p className="text-gray-600 text-sm">Certified professionals with years of heavy-duty truck experience</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">✓ Quality Parts</h4>
                                <p className="text-gray-600 text-sm">OEM and aftermarket parts from trusted manufacturers</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">✓ Fast Turnaround</h4>
                                <p className="text-gray-600 text-sm">We know downtime costs money - we work efficiently</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">✓ Competitive Pricing</h4>
                                <p className="text-gray-600 text-sm">Fair rates with transparent estimates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}