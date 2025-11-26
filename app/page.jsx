import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { generateMetadata as generateMeta } from '@/lib/seo'

export const metadata = generateMeta({
    title: 'Premium Heavy-Duty Truck Parts & Complete Trucks',
    description: 'CoreComponents offers premium parts for Freightliner, Peterbilt, Kenworth, and International trucks. Engine parts, brake systems, transmissions, and complete truck sales in Brampton, Ontario.',
    path: '/'
})

export default async function Home() {
  const { data: products } = await supabase
    .from("parts")
    .select("*")
    .eq("featured", true)
    .limit(4);

  return (
    <div>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - WITH BRANDED BACKGROUND */}
        <section className="relative bg-[#1a1f3a] text-white py-32 overflow-hidden">
            {/* Background Image Pattern */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://gsadmhqpzhkmgmcvxbdi.supabase.co/storage/v1/object/public/product-images/hero_background.png"
                    alt="CoreComponents Background"
                    fill
                    className="object-cover opacity-70"
                    priority
                    quality={75}
                />
            </div>
            
            {/* Subtle Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
            
            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 relative z-20">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                        Professional Trucking Parts & Components
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md">
                        Quality parts for your fleet since 2020. Competitive pricing, fast delivery, expert service.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/catalog"
                            className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                        >
                            Browse Catalog
                        </Link>
                        <Link
                            href="/trucks"
                            className="bg-white text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            View Trucks
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        <div>
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
                Featured Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-semibold text-gray-900 mb-2">
                        Starting from ${product.price}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock_status === "in_stock"
                            ? "bg-green-100 text-green-800"
                            : product.stock_status === "low_stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock_status === "in_stock"
                          ? "In Stock"
                          : product.stock_status === "low_stock"
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
