'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (error) throw error

            // Success - force full page reload to refresh user state
            window.location.href = '/'

        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Invalid email or password')
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
                        <h1 className="text-3xl font-bold mb-2">Customer Login</h1>
                        <p className="text-gray-600 mb-6">Sign in to see your exclusive pricing</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
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
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
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
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                                Sign up now
                            </Link>
                        </p>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            <Link href="/admin/login" className="hover:underline">
                                Admin login
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}