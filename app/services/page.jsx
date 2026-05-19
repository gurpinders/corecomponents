import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Our Services | CoreComponents',
    description: 'Professional truck parts and delivery services in Brampton, Ontario'
}

export default function ServicesPage() {
    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Our Services</h1>
                        <p className="text-gray-400 text-lg">Everything you need to keep your fleet running</p>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

                    {/* Request a Part */}
                    <div id="request-a-part" className="bg-white/5 border border-white/10 rounded-2xl p-10">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-3">Request a Part</h2>
                                <p className="text-gray-400 leading-relaxed mb-4">Can't find what you need in our catalog? We source parts not listed online. Call or text us with the part details and we'll track it down for you.</p>
                                <div className="flex gap-3">
                                    <a href="tel:6479938235" className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                                        Call (647) 993-8235
                                    </a>
                                    <a href="sms:6479938235" className="bg-navy text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-navy-light transition-colors">
                                        Text Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div id="shipping" className="bg-white/5 border border-white/10 rounded-2xl p-10">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-3">Shipping Information</h2>
                                <p className="text-gray-400 leading-relaxed mb-4">We offer free same-day dispatch on all in-stock items across the Greater Toronto Area. Orders placed before 2PM are dispatched the same day.</p>
                                <div className="space-y-3">
                                    {[
                                        { label: 'GTA Delivery', value: 'Free — same day dispatch' },
                                        { label: 'Outside GTA', value: 'Contact us for rates' },
                                        { label: 'Pickup', value: 'Available at our Brampton location' },
                                        { label: 'Hours', value: 'Mon–Fri 8AM–6PM, Sat 9AM–4PM' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="text-gray-400 text-sm">{item.label}</span>
                                            <span className="text-white text-sm font-medium">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warranty & Returns */}
                    <div id="warranty" className="bg-white/5 border border-white/10 rounded-2xl p-10">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-3">Warranty & Returns</h2>
                                <p className="text-gray-400 leading-relaxed mb-4">Every part we sell is inspected before it leaves our warehouse. We stand behind our inventory and will work with you on any issues.</p>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Quality Check', value: 'All parts inspected before shipping' },
                                        { label: 'Issues', value: 'Contact us within 7 days of delivery' },
                                        { label: 'Resolution', value: 'Replacement or store credit' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="text-gray-400 text-sm">{item.label}</span>
                                            <span className="text-white text-sm font-medium">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm mt-4">For warranty claims or return questions, call us directly at <a href="tel:6479938235" className="text-white hover:text-gray-300 transition-colors">(647) 993-8235</a></p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-navy border border-navy-light rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">Have a question about any of our services?</h2>
                        <p className="text-white/70 mb-6">Our team is available Monday to Saturday to help.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="tel:6479938235" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                📞 Call (647) 993-8235
                            </a>
                            <a href="sms:6479938235" className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">
                                💬 Text Us
                            </a>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}