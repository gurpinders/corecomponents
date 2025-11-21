import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function WarrantyPage() {
    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">Warranty & Returns</h1>

                    {/* Warranty Coverage */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Warranty Coverage</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3">✓ Standard Warranty</h3>
                                <p className="text-gray-700 mb-2">
                                    All new parts come with a <strong>90-day warranty</strong> from the date of purchase against defects in materials and workmanship.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Covers: Manufacturing defects, premature failure under normal use
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-3">✓ Extended Warranty Available</h3>
                                <p className="text-gray-700 mb-2">
                                    Select parts qualify for extended warranty coverage up to <strong>1 year</strong>. Ask our team for details.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-3">✓ OEM Parts Warranty</h3>
                                <p className="text-gray-700 mb-2">
                                    OEM (Original Equipment Manufacturer) parts carry the manufacturer's warranty. Documentation provided at purchase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Not Covered */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-red-900">Warranty Exclusions</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li>✗ Improper installation or misuse</li>
                            <li>✗ Normal wear and tear</li>
                            <li>✗ Damage caused by accidents or modifications</li>
                            <li>✗ Parts used in racing or competition</li>
                            <li>✗ Electrical parts damaged by incorrect voltage</li>
                        </ul>
                    </div>

                    {/* Return Policy */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2">30-Day Return Window</h3>
                                <p className="text-gray-700">
                                    Unused parts in original packaging may be returned within 30 days of purchase for a full refund or exchange.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">Conditions for Returns:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>✓ Must be in original packaging</li>
                                    <li>✓ Must be unused and resalable</li>
                                    <li>✓ Original receipt or proof of purchase required</li>
                                    <li>✓ Restocking fee may apply (15% for special orders)</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                                <h4 className="font-bold mb-2">Non-Returnable Items:</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Electrical parts (unless defective)</li>
                                    <li>• Custom-ordered or special-order parts</li>
                                    <li>• Opened fluids, chemicals, or filters</li>
                                    <li>• Cut-to-length items (hoses, belts, etc.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Warranty Claims */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">How to Make a Warranty Claim</h2>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                                <div>
                                    <h3 className="font-bold mb-1">Contact Us</h3>
                                    <p className="text-gray-600">Call or email us with your order number and description of the issue.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-2xl font-bold text-blue-600">2</span>
                                <div>
                                    <h3 className="font-bold mb-1">Provide Documentation</h3>
                                    <p className="text-gray-600">We may request photos, receipt, and part details for evaluation.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-2xl font-bold text-blue-600">3</span>
                                <div>
                                    <h3 className="font-bold mb-1">Return Authorization</h3>
                                    <p className="text-gray-600">If approved, we'll provide an RMA number and return instructions.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-2xl font-bold text-blue-600">4</span>
                                <div>
                                    <h3 className="font-bold mb-1">Resolution</h3>
                                    <p className="text-gray-600">We'll repair, replace, or refund the defective part promptly.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-black text-white rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Questions About Warranty or Returns?</h2>
                        <p className="mb-6">Our team is here to help you with any warranty claims or return requests.</p>
                        <div className="flex gap-4 justify-center">
                            <a 
                                href="tel:647-993-8235" 
                                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200"
                            >
                                📞 Call Us
                            </a>
                            <Link 
                                href="/contact" 
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-700"
                            >
                                Contact Form
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}