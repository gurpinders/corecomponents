'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        })

        if (signInError) {
            setError(signInError.message === 'Invalid login credentials'
                ? 'Invalid email or password. Please try again.'
                : signInError.message)
            setLoading(false)
            return
        }

        window.location.href = '/'
    }

    return (
        <div className="bg-black">
            <Header />
            <main className="min-h-screen flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-md">

                    {/* Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-gray-400 mb-8">Sign in to see your exclusive pricing</p>

                        {error && (
                            <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-400 mt-6">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-white font-semibold hover:text-gray-300 transition-colors">
                                Sign up now
                            </Link>
                        </p>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            <Link href="/admin/login" className="hover:text-gray-400 transition-colors">
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