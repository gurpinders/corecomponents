import Link from "next/link";
import Image from "next/image";

export default function Footer(){
    return(
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        {/* Logo instead of text */}
                        <Image 
                            src="/logo.png" 
                            alt="CoreComponents Logo" 
                            width={1600} 
                            height={900} 
                            className="h-16 w-auto mb-4"
                        />
                        <p className="text-gray-400">Quality Trucking Parts Since 2020</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/catalog" className="text-gray-400 hover:text-white transition-colors">Catalog</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <p className="text-gray-400 mb-2">Phone: (647) 993-8235</p>
                        <p className="text-gray-400 mb-2">Email: info@ccomponents.ca</p>
                        <p className="text-gray-400 mb-2">Business Hours: Mon - Sat (8AM - 9PM EST)</p>
                    </div> 
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>© 2025 CoreComponents. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}