'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        setSubmitted(true)
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            setSubmitted(false)
        }, 3000)
    }

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen">

                {/* Page Header */}
                <section className="bg-black py-16 border-b border-white/10">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
                        <p className="text-gray-400 text-lg">We're here to help with your truck parts needs</p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left — Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
                                <div className="space-y-6">

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Phone</h3>
                                            <a href="tel:6479938235" className="text-blue-400 hover:text-blue-300 text-lg transition-colors">
                                                (647) 993-8235
                                            </a>
                                            <p className="text-sm text-gray-400 mt-1">Mon-Fri: 8AM-6PM EST<br/>Sat: 9AM-4PM EST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Email</h3>
                                            <a href="mailto:info@ccomponents.ca" className="text-blue-400 hover:text-blue-300 transition-colors">
                                                info@ccomponents.ca
                                            </a>
                                            <p className="text-sm text-gray-400 mt-1">We respond within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Location</h3>
                                            <p className="text-gray-400">Brampton, Ontario<br/>Canada</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Service Area</h3>
                                            <p className="text-gray-400">Greater Toronto Area<br/>Free shipping in GTA</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Need Parts Fast CTA */}
                            <div className="bg-navy border border-navy-light rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-3">Need Parts Fast?</h3>
                                <p className="text-white/70 mb-5">Call us directly for immediate assistance with urgent orders or technical questions.</p>
                                <a
                                    href="tel:6479938235"
                                    className="inline-block bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Call Now: (647) 993-8235
                                </a>
                            </div>
                        </div>

                        {/* Right — Contact Form */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                            {submitted && (
                                <div className="bg-green-900/50 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6">
                                    ✓ Thank you! We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(647) 123-4567"
                                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Subject *</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="parts">Parts Inquiry</option>
                                        <option value="trucks">Truck Sales</option>
                                        <option value="quote">Request Quote</option>
                                        <option value="shipping">Shipping Question</option>
                                        <option value="warranty">Warranty/Returns</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="Tell us how we can help..."
                                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}