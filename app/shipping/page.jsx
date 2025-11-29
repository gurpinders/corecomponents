import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ShippingPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

                    {/* Delivery Options */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Delivery Options</h2>
                        
                        <div className="space-y-6">
                            {/* Pickup */}
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="text-xl font-bold mb-2">Pick Up in Brampton</h3>
                                <p className="text-gray-700 mb-2"><strong>Cost:</strong> FREE</p>
                                <p className="text-gray-700 mb-2"><strong>Time:</strong> Ready in 2-4 hours</p>
                                <p className="text-gray-600">
                                    Pick up your parts at our Brampton location. We'll have your order ready for you, usually within 2-4 hours of ordering.
                                </p>
                            </div>

                            {/* Local Delivery */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-xl font-bold mb-2">Local Delivery (GTA)</h3>
                                <p className="text-gray-700 mb-2"><strong>Cost:</strong> FREE</p>
                                <p className="text-gray-700 mb-2"><strong>Time:</strong> 1-2 business days</p>
                                <p className="text-gray-600">
                                    Free delivery within the Greater Toronto Area. Orders placed before 2 PM are typically delivered the next business day.
                                </p>
                            </div>

                            {/* Shipping */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-xl font-bold mb-2">Shipping (Canada-wide)</h3>
                                <p className="text-gray-700 mb-2"><strong>Cost:</strong> $50 flat rate</p>
                                <p className="text-gray-700 mb-2"><strong>Time:</strong> 3-7 business days</p>
                                <p className="text-gray-600">
                                    We ship across Canada via reliable carriers. Tracking information provided for all shipments.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Coverage Area */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Free Delivery Coverage</h2>
                        <p className="text-gray-700 mb-4">
                            Free local delivery is available to the following areas:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Toronto</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Brampton</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Mississauga</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Vaughan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Markham</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Richmond Hill</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Oakville</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Ajax</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Pickering</span>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm">
                            Not in our free delivery zone? Contact us for a shipping quote.
                        </p>
                    </div>

                    {/* International Shipping */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold mb-3">International & Freight Shipping</h2>
                        <p className="text-gray-700 mb-4">
                            We ship worldwide! For large orders, freight shipments, or international destinations, please contact us for a custom quote.
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                href="/contact" 
                                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                            >
                                Contact for Quote
                            </Link>
                            <a 
                                href="tel:905-XXX-XXXX" 
                                className="bg-white text-black border-2 border-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
                            >
                                Call Us
                            </a>
                        </div>
                    </div>

                    {/* Order Processing */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-6">Order Processing</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold mb-2">Order Confirmation</h3>
                                <p className="text-gray-600">
                                    You'll receive an email confirmation immediately after placing your order with order details and estimated delivery time.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Tracking Information</h3>
                                <p className="text-gray-600">
                                    For shipped orders, tracking information will be emailed to you once your order ships.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Processing Time</h3>
                                <p className="text-gray-600">
                                    Most orders are processed within 2-4 hours during business hours (Monday-Friday, 8 AM - 5 PM).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}