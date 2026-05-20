import Link from "next/link";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import HeroButtons from '@/components/HeroButtons'
import HeroHeading from '@/components/HeroHeading'
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

  const { count: partCount } = await supabase
    .from("parts")
    .select("id", { count: 'exact', head: true })

  return (
    <div className="bg-black">
      <Header />
      <main className="min-h-screen">

        {/* Hero Section */}
        <section className="relative bg-black text-white py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://gsadmhqpzhkmgmcvxbdi.supabase.co/storage/v1/object/public/product-images/hero_background.webp"
              alt="CoreComponents Background"
              fill
              className="object-cover opacity-70"
              priority
              quality={75}
            />
          </div>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-20">
            <div className="max-w-3xl">
              <HeroHeading />
              <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md">
                Quality parts for your fleet since 2020. Competitive pricing, fast delivery, expert service.
              </p>
              <HeroButtons partCount={partCount || 0} />
            </div>
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Browse by Category</h2>
            <p className="text-center text-gray-400 mb-12">Select a category to see what we have in stock</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Engines', desc: 'DD15, Cummins, Volvo, CAT, Paccar', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=70' },
                { name: 'Transmissions', desc: 'DT12, ATO2612F, 18 Speed Manual', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70' },
                { name: 'One Box', desc: 'Volvo, Cascadia, Cummins, Paccar', img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&q=70' },
                { name: 'ECM & Electrical', desc: 'ACM, CPC, ABS modules', img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=70' },
                { name: 'Clutch Actuators', desc: 'DT12 and I Shift actuators', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=70' },
                { name: 'Body & Accessories', desc: 'Doors, hoods, cab accessories', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=70' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href="/catalog"
                  className="relative rounded-xl overflow-hidden h-52 block group"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-55 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-white/80 text-sm">{cat.desc}</p>
                    <span className="text-white/60 text-xs mt-2 inline-block">View parts →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Why Choose CoreComponents?</h2>
            <p className="text-center text-gray-400 mb-12">Real inventory, real people — no middleman</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="border border-white/10 rounded-xl p-8">
                <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Same-Day Dispatch</h3>
                <p className="text-gray-400 leading-relaxed">In-stock parts ship the same day across the Greater Toronto Area, free of charge.</p>
              </div>

              <div className="border border-white/10 rounded-xl p-8">
                <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Call or Text Us</h3>
                <p className="text-gray-400 leading-relaxed">Speak directly with our team at (647) 993-8235. No bots, no hold queues — just real answers.</p>
              </div>

              <div className="border border-white/10 rounded-xl p-8">
                <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Quality Guaranteed</h3>
                <p className="text-gray-400 leading-relaxed">Every part is inspected before it leaves our Brampton warehouse. We stand behind what we sell.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Featured Products</h2>
            <p className="text-center text-gray-400 mb-12">A selection of what we currently have in stock</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-white/30 hover:-translate-y-1 transition-all duration-200"
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
                    <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-gray-300 mb-2">
                      Starting from ${product.price}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      product.stock_status === "in_stock"
                        ? "bg-green-900/50 text-green-400"
                        : product.stock_status === "low_stock"
                        ? "bg-yellow-900/50 text-yellow-400"
                        : "bg-red-900/50 text-red-400"
                    }`}>
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

      </main>
      <Footer />
    </div>
  );
}