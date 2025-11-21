import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'


export default function Header(){
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return(
        <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
                <Link href={"/"}>
                    <Image src="/logo.png" alt="CoreComponents Logo" width={1600} height={900} className='h-24 w-auto'/>
                </Link>
                <nav>
                    <ul className='flex gap-8'>
                        <li>
                            <Link href={"/"} className="text-gray-600 hover:text-black font-semibold text-lg transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href={"/catalog"} className="text-gray-600 hover:text-black font-semibold text-lg transition-colors">Catalog</Link>
                        </li>
                        <li>
                            <Link href={"/about"} className="text-gray-600 hover:text-black font-semibold text-lg transition-colors">About</Link>
                        </li>
                        <li>
                            <Link href={"/contact"} className="text-gray-600 hover:text-black font-semibold text-lg transition-colors">Contact</Link>
                        </li>
                        <li>
                            {/* Cart Icon */}
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
            </div>
        </header>
    )
}
