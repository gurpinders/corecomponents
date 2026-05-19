'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getUser, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => { checkAuth() }, [])

    const checkAuth = async () => {
        const { user, error } = await getUser()

        if (error || !user) {
            if (pathname !== '/admin/login') router.push('/admin/login')
            setLoading(false)
            return
        }

        // Check if user's email is in admin_users table
        const { data: adminUsers } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', user.email)

        const adminUser = adminUsers?.[0] || null

        if (!adminUser) {
            // User is logged in but not an admin — sign them out and redirect
            await signOut()
            router.push('/admin/login')
            setLoading(false)
            return
        }

        setUser(user)
        setLoading(false)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/admin/login')
    }

    if (pathname === '/admin/login') return children

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Redirecting...</p>
            </div>
        )
    }

    const navLinks = [
        { href: '/admin', label: 'Dashboard', match: (path) => path === '/admin' },
        { href: '/admin/parts', label: 'Parts', match: (path) => path.startsWith('/admin/parts') },
        { href: '/admin/trucks', label: 'Trucks', match: (path) => path.startsWith('/admin/trucks') },
        { href: '/admin/customers', label: 'Customers', match: (path) => path.startsWith('/admin/customers') },
        { href: '/admin/campaigns', label: 'Campaigns', match: (path) => path.startsWith('/admin/campaigns') },
        { href: '/admin/categories', label: 'Categories', match: (path) => path.startsWith('/admin/categories') },
    ]

    return (
        <div className="min-h-screen bg-black">

            {/* Header */}
            <header className="bg-black border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-between items-center">

                        {/* Logo + Admin Badge */}
                        <Link href="/admin" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                            <Image
                                src="/logo_white.png"
                                alt="CoreComponents Logo"
                                width={1600}
                                height={900}
                                className="h-10 sm:h-14 md:h-16 w-auto"
                            />
                            <span className="bg-navy text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider">
                                Admin
                            </span>
                        </Link>

                        {/* Desktop: Email + Logout */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-400">{user?.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile: Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                            <nav className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block py-2 px-3 rounded-lg font-medium transition-colors ${
                                            link.match(pathname)
                                                ? 'bg-white text-black'
                                                : 'text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-t border-white/10 pt-3 mt-3">
                                    <div className="text-xs text-gray-500 px-3 mb-2">{user?.email}</div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left py-2 px-3 text-red-400 hover:bg-white/10 rounded-lg font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Desktop Nav */}
            <nav className="bg-black border-b border-white/10 hidden md:block">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-6 lg:gap-8 py-4 overflow-x-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors ${
                                    link.match(pathname)
                                        ? 'text-white border-b-2 border-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8">
                {children}
            </div>

        </div>
    )
}