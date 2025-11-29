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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image 
                            src="/logo.png" 
                            alt="CoreComponents Logo" 
                            width={1600} 
                            height={900} 
                            className="h-16 w-auto"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user?.email}</span>
                        <button
                            onClick={handleSignOut}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8 py-4">
                        <Link 
                            href="/admin" 
                            className={`pb-2 ${
                                pathname === '/admin' 
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            href="/admin/parts" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/parts')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Parts
                        </Link>
                        <Link 
                            href="/admin/trucks" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/trucks')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Trucks
                        </Link>
                        <Link 
                            href="/admin/customers" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/customers')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Customers
                        </Link>
                        <Link 
                            href="/admin/quotes" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/quotes')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Quotes
                        </Link>
                        <Link 
                            href="/admin/campaigns" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/campaigns')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Campaigns
                        </Link>
                        <Link 
                            href="/admin/categories" 
                            className={`pb-2 ${
                                pathname.startsWith('/admin/categories')
                                    ? 'font-medium text-black border-b-2 border-black' 
                                    : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            Categories
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            {children}
        </div>
    )
}