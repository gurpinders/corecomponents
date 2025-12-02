'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getUser, signOut } from '@/lib/auth'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const { user, error } = await getUser()
        if (error || !user) {
            // Only redirect if not on login page
            if (pathname !== '/admin/login') {
                router.push('/admin/login')
            }
        } else {
            setUser(user)
        }
        setLoading(false)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/admin/login')
    }

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return children
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    // If not authenticated and not on login page, show loading
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Redirecting...</p>
            </div>
        )
    }

    const navLinks = [
        { href: '/admin', label: 'Dashboard', match: (path) => path === '/admin' },
        { href: '/admin/parts', label: 'Parts', match: (path) => path.startsWith('/admin/parts') },
        { href: '/admin/trucks', label: 'Trucks', match: (path) => path.startsWith('/admin/trucks') },
        { href: '/admin/customers', label: 'Customers', match: (path) => path.startsWith('/admin/customers') },
        { href: '/admin/quotes', label: 'Quotes', match: (path) => path.startsWith('/admin/quotes') },
        { href: '/admin/campaigns', label: 'Campaigns', match: (path) => path.startsWith('/admin/campaigns') },
        { href: '/admin/categories', label: 'Categories', match: (path) => path.startsWith('/admin/categories') },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo + Admin Badge */}
                        <Link href="/admin" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                            <Image 
                                src="/logo.png" 
                                alt="CoreComponents Logo" 
                                width={1600} 
                                height={900} 
                                className="h-10 sm:h-14 md:h-16 w-auto"
                            />
                            <span className="bg-black text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider">
                                Admin
                            </span>
                        </Link>

                        {/* Desktop: Email + Logout */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile: Hamburger Menu */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="md:hidden mt-4 pb-4 border-t pt-4">
                            <nav className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block py-2 px-3 rounded-lg font-medium ${
                                            link.match(pathname)
                                                ? 'bg-black text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-t pt-3 mt-3">
                                    <div className="text-xs text-gray-500 px-3 mb-2">{user?.email}</div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Desktop Navigation */}
            <nav className="bg-white border-b border-gray-200 hidden md:block">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-4 lg:gap-8 py-4 overflow-x-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`pb-2 whitespace-nowrap ${
                                    link.match(pathname)
                                        ? 'font-medium text-black border-b-2 border-black'
                                        : 'text-gray-600 hover:text-black'
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