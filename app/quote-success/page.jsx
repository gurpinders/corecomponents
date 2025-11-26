import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function QuoteSuccessPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-lg shadow-lg p-12">
                        <div className="text-6xl mb-6">✓</div>
                        <h1 className="text-4xl font-bold text-green-600 mb-4">Quote Request Submitted!</h1>
                        <p className="text-xl text-gray-700 mb-6">
                            Thank you for your quote request. We've received your information and will contact you within 24 hours.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                            <h3 className="font-bold text-blue-900 mb-3">What's Next?</h3>
                            <ul className="space-y-2 text-blue-800">
                                <li>✓ Check your email for a confirmation</li>
                                <li>✓ Our team will prepare a detailed quote</li>
                                <li>✓ We'll contact you within 24 business hours</li>
                                <li>✓ Questions? Call us at (647) 993-8235</li>
                            </ul>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/catalog"
                                className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}