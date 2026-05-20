'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'

export default function Header(){
    const { user, checkUser, clearCart } = useCart()

    const [categories, setCategories] = useState([])
    const [partsDropdownOpen, setPartsDropdownOpen] = useState(false)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobilePartsOpen, setMobilePartsOpen] = useState(false)
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
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
        clearCart()
        checkUser()
        window.location.href = '/'
    }

    return(
        <header className="sticky top-0 z-50 bg-black">
            <div className='max-w-7xl mx-auto px-6 py-4'>
                <div className='flex items-center justify-between'>

                    {/* Logo */}
                    <Link href={"/"}>
                        <Image
                            src="/logo_white.png"
                            alt="CoreComponents Logo"
                            width={1600}
                            height={900}
                            className='h-16 md:h-24 w-auto'
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:block'>
                        <ul className='flex gap-8 items-center'>

                            <li>
                                <Link href={"/"} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                    Home
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            {/* Parts Dropdown */}
                            <li
                                className="relative"
                                onMouseEnter={() => { if (partsTimeout) clearTimeout(partsTimeout); setPartsDropdownOpen(true) }}
                                onMouseLeave={() => { const t = setTimeout(() => setPartsDropdownOpen(false), 300); setPartsTimeout(t) }}
                            >
                                <Link href={"/catalog"} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors flex items-center gap-1 group">
                                    Parts
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${partsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                {partsDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#111] border border-white/10 rounded-lg shadow-xl py-2">
                                        <Link href="/catalog" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 font-medium transition-colors">
                                            Browse All Parts
                                        </Link>
                                        <div className="border-t border-white/10 my-2"></div>
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Categories</div>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/catalog/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                                className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>

                            {/* Trucks */}
                            <li>
                                <Link href={"/trucks"} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                    Trucks
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            {/* Services Dropdown */}
                            <li
                                className="relative"
                                onMouseEnter={() => { if (servicesTimeout) clearTimeout(servicesTimeout); setServicesDropdownOpen(true) }}
                                onMouseLeave={() => { const t = setTimeout(() => setServicesDropdownOpen(false), 300); setServicesTimeout(t) }}
                            >
                                <Link href="/services" className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors flex items-center gap-1 group">
                                    Services
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                {servicesDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-[#111] border border-white/10 rounded-lg shadow-xl py-2">
                                        <Link href="/services#request-a-part" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                                            Request a Part
                                        </Link>
                                        <Link href="/services#shipping" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                                            Shipping Information
                                        </Link>
                                        <Link href="/services#warranty" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                                            Warranty & Returns
                                        </Link>
                                    </div>
                                )}
                            </li>

                            <li>
                                <Link href={"/about"} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                    About
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            <li>
                                <Link href={"/contact"} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                    Contact
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            {/* Auth Links */}
                            {user ? (
                                <>
                                    <li>
                                        <Link href="/account" className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                            Account
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                            Logout
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className="relative text-white/80 hover:text-white font-semibold text-lg transition-colors group">
                                            Login
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/signup" className="bg-navy text-white px-4 py-2 rounded-lg font-semibold hover:bg-navy-light transition-all transform hover:scale-105">
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}

                        </ul>
                    </nav>

                    {/* Mobile: Hamburger */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                        <nav className="space-y-1">
                            <Link href="/" className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Home
                            </Link>

                            {/* Parts Expandable */}
                            <div>
                                <button onClick={() => setMobilePartsOpen(!mobilePartsOpen)} className="w-full flex items-center justify-between py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium">
                                    <span>Parts</span>
                                    <svg className={`w-4 h-4 transition-transform ${mobilePartsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobilePartsOpen && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        <Link href="/catalog" className="block py-2 px-3 text-sm text-white/60 hover:bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                            Browse All Parts
                                        </Link>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/catalog/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                                className="block py-2 px-3 text-sm text-white/60 hover:bg-white/10 rounded-lg"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link href="/trucks" className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Trucks
                            </Link>

                            {/* Services Expandable */}
                            <div>
                                <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="w-full flex items-center justify-between py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium">
                                    <span>Services</span>
                                    <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobileServicesOpen && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        <Link href="/services#request-a-part" className="block py-2 px-3 text-sm text-white/60 hover:bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                            Request a Part
                                        </Link>
                                        <Link href="/services#shipping" className="block py-2 px-3 text-sm text-white/60 hover:bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                            Shipping Information
                                        </Link>
                                        <Link href="/services#warranty" className="block py-2 px-3 text-sm text-white/60 hover:bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                            Warranty & Returns
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/about" className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                About
                            </Link>
                            <Link href="/contact" className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Contact
                            </Link>

                            {user ? (
                                <>
                                    <Link href="/account" className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                        Account
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                                        className="block py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg font-medium w-full text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2 px-3 pt-2">
                                    <Link href="/login" className="flex-1 py-2 text-center border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link href="/signup" className="flex-1 py-2 text-center bg-navy text-white rounded-lg font-semibold hover:bg-navy-light" onClick={() => setMobileMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            {/* Promotional Bar */}
            <div className="bg-[#001f54] text-white py-2 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 flex-nowrap overflow-hidden">
                        <span className="font-bold text-xs flex items-center gap-1 whitespace-nowrap">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            647-993-8235
                        </span>
                        <span className="text-white/50">|</span>
                        <span className="font-semibold text-xs flex items-center gap-1 whitespace-nowrap">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            Free Delivery GTA
                        </span>
                        <span className="text-white/50">|</span>
                        <span className="font-semibold text-xs flex items-center gap-1 whitespace-nowrap">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            5% Off Members
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}