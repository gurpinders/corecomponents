'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'

export default function Header(){
    const router = useRouter()
    const { getCartCount, user, checkUser, clearCart, cart } = useCart()
    const cartCount = getCartCount()

    const [categories, setCategories] = useState([])
    const [partsDropdownOpen, setPartsDropdownOpen] = useState(false)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [partsTimeout, setPartsTimeout] = useState(null)
    const [servicesTimeout, setServicesTimeout] = useState(null)
    const [scrolled, setScrolled] = useState(false)
    const [cartHovered, setCartHovered] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    // Track scroll for sticky navbar with blur
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
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

    // Calculate cart total
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return(
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
                : 'bg-white border-b border-gray-200 shadow-sm'
        }`}>
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
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                >
                                    Home
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            {/* Parts Dropdown - Simple version (not mega menu) */}
                            <li 
                                className="relative"
                                onMouseEnter={() => {
                                    if (partsTimeout) clearTimeout(partsTimeout)
                                    setPartsDropdownOpen(true)
                                }}
                                onMouseLeave={() => {
                                    const timeout = setTimeout(() => {
                                        setPartsDropdownOpen(false)
                                    }, 300)
                                    setPartsTimeout(timeout)
                                }}
                            >
                                <Link 
                                    href={"/catalog"} 
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors flex items-center gap-1 group"
                                >
                                    Parts
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${partsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                
                                {/* Parts Dropdown Menu */}
                                {partsDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-scale-in">
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

                            {/* Trucks */}
                            <li>
                                <Link 
                                    href={"/trucks"} 
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                >
                                    Trucks
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
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
                                    }, 300)
                                    setServicesTimeout(timeout)
                                }}
                            >
                                <Link
                                    href="/services"
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors flex items-center gap-1 group"
                                >
                                    Services
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                
                                {/* Services Dropdown Menu */}
                                {servicesDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-scale-in">
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
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                >
                                    About
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/contact"} 
                                    className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                >
                                    Contact
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>

                            {/* Auth Links */}
                            {user ? (
                                <>
                                    <li>
                                        <Link 
                                            href="/account" 
                                            className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                        >
                                            Account
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                        >
                                            Logout
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link 
                                            href="/login" 
                                            className="relative text-gray-600 hover:text-black font-semibold text-lg transition-colors group"
                                        >
                                            Login
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/signup" 
                                            className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}

                            {/* Cart Icon with Preview */}
                            <li 
                                className="relative"
                                onMouseEnter={() => setCartHovered(true)}
                                onMouseLeave={() => setCartHovered(false)}
                            >
                                <Link href="/cart" className="relative group">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Cart Preview Dropdown */}
                                {cartHovered && cartCount > 0 && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-scale-in">
                                        <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b">Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h3>
                                        <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-3 mb-3">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total:</span>
                                                <span>${cartTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link 
                                                href="/cart" 
                                                className="flex-1 bg-gray-200 text-gray-800 text-center py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                            >
                                                View Cart
                                            </Link>
                                            <Link 
                                                href="/request-quote" 
                                                className="flex-1 bg-black text-white text-center py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                            >
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                )}
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

            {/* Promotional Bar - Navy Blue */}
            <div className="bg-[#001f54] text-white py-4 text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
                        <span className="font-bold text-lg flex items-center gap-2">
                            📞 <span>Call Us: 647-993-8235</span>
                        </span>
                        <span className="hidden md:block text-white/50">|</span>
                        <span className="font-semibold text-base flex items-center gap-2">
                            🚚 <span>Free Delivery in GTA</span>
                        </span>
                        <span className="hidden md:block text-white/50">|</span>
                        <span className="font-semibold text-base flex items-center gap-2">
                            💰 <span>Save 5% as a Registered Customer</span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}