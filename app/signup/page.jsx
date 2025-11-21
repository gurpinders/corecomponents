'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            })

            if (authError) throw authError

            // Create customer record
            const { error: customerError } = await supabase
                .from('customers')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    auth_user_id: authData.user.id,
                    subscribed: true
                }])

            if (customerError) throw customerError

            // Success - redirect to catalog
            alert('Account created successfully! You can now see customer pricing.')
            router.push('/catalog')

        } catch (err) {
            console.error('Signup error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-md mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-gray-600 mb-6">Sign up to see exclusive customer pricing (5% off!)</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}