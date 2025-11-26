'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'

export default function Header(){
    const router = useRouter()
    const { getCartCount, user, checkUser } = useCart()
    const cartCount = getCartCount()

    const [categories, setCategories] = useState([])
    const [partsDropdownOpen, setPartsDropdownOpen] = useState(false)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [partsTimeout, setPartsTimeout] = useState(null)
    const [servicesTimeout, setServicesTimeout] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('name')
            .limit(8)
        
        if (data) setCategories(data)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        checkUser()
        window.location.href = '/'
    }

    return(
        <header className='bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-6 py-4'>
                {/* Desktop Header */}
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    <Link href={"/"}>
                        <Image 
                            src="/logo.png" 
                            alt="CoreComponents Logo" 
                            width={1600} 
                            height={900} 
                            className='h-24 w-auto'
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:block'>
                        <ul className='flex gap-8 items-center'>
                            <li>
                                <Link 
                                    href={"/"} 
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                >
                                    Home
                                </Link>
                            </li>

                            {/* Parts Dropdown */}
                            <li 
                                className="relative"
                                onMouseEnter={() => {
                                    if (partsTimeout) clearTimeout(partsTimeout)
                                    setPartsDropdownOpen(true)
                                }}
                                onMouseLeave={() => {
                                    const timeout = setTimeout(() => {
                                        setPartsDropdownOpen(false)
                                    }, 300) // 300ms delay
                                    setPartsTimeout(timeout)
                                }}
                            >
                                <Link 
                                    href={"/catalog"} 
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors flex items-center gap-1"
                                >
                                    Parts
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                                
                                {/* Parts Dropdown Menu */}
                                {partsDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                        <Link 
                                            href="/catalog" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                                        >
                                            Browse All Parts
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                            Categories
                                        </div>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/catalog?category=${category.id}`}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                        {categories.length > 0 && (
                                            <Link 
                                                href="/catalog" 
                                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 font-medium mt-2 border-t border-gray-200"
                                            >
                                                View All Categories →
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </li>

                            {/* Trucks - Coming Soon */}
                            <li>
                                <Link 
                                    href={"/trucks"} 
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                >
                                    Trucks
                                </Link>
                            </li>

                            {/* Services Dropdown */}
                            <li 
                                className="relative"
                                onMouseEnter={() => {
                                    if (servicesTimeout) clearTimeout(servicesTimeout)
                                    setServicesDropdownOpen(true)
                                }}
                                onMouseLeave={() => {
                                    const timeout = setTimeout(() => {
                                        setServicesDropdownOpen(false)
                                    }, 300) // 300ms delay
                                    setServicesTimeout(timeout)
                                }}
                            >
                                <Link
                                    href="/services"
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors flex items-center gap-1"
                                >
                                    Services
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                                
                                {/* Services Dropdown Menu */}
                                {servicesDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                        <Link 
                                            href="/request-part" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Request a Part
                                        </Link>
                                        <Link 
                                            href="/shipping" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Shipping Information
                                        </Link>
                                        <Link 
                                            href="/warranty" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Warranty & Returns
                                        </Link>
                                    </div>
                                )}
                            </li>

                            <li>
                                <Link 
                                    href={"/about"} 
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/contact"} 
                                    className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>

                            {/* Auth Links */}
                            {user ? (
                                <>
                                    <li>
                                        <Link 
                                            href="/account" 
                                            className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                        >
                                            Account
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link 
                                            href="/login" 
                                            className="text-gray-600 hover:text-black font-semibold text-lg transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/signup" 
                                            className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}

                            {/* Cart Icon */}
                            <li>
                                <Link href="/cart" className="relative">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t pt-4">
                        <nav className="space-y-2">
                            <Link href="/" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Home
                            </Link>
                            <Link href="/catalog" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Parts
                            </Link>
                            <Link href="/trucks" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Trucks
                            </Link>
                            <Link href="/request-part" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Request a Part
                            </Link>
                            <Link href="/about" className="block py-2 text-gray-700 hover:text-black font-medium">
                                About
                            </Link>
                            <Link href="/contact" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Contact
                            </Link>
                            
                            {user ? (
                                <>
                                    <Link href="/account" className="block py-2 text-gray-700 hover:text-black font-medium">
                                        Account
                                    </Link>
                                    <button onClick={handleLogout} className="block py-2 text-gray-700 hover:text-black font-medium w-full text-left">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block py-2 text-gray-700 hover:text-black font-medium">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="block py-2 bg-black text-white px-4 rounded-lg font-medium text-center">
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            <Link href="/cart" className="block py-2 text-gray-700 hover:text-black font-medium">
                                Cart ({cartCount})
                            </Link>
                        </nav>
                    </div>
                )}
            </div>

            {/* Promotional Bar */}
            <div className="bg-black text-white py-2 text-center text-sm">
                <span className="font-medium">📞 Call Us: 647-993-8235</span>
                <span className="mx-4">|</span>
                <span>🚚 Free Delivery in GTA</span>
                <span className="mx-4">|</span>
                <span>✨ Save 5% as a Registered Customer</span>
            </div>
        </header>
    )
}