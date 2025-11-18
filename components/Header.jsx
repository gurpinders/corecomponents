import Link from 'next/link'
import Image from 'next/image'


export default function Header(){
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
                    </ul>
                </nav>
            </div>
        </header>
    )
}
