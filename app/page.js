import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

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
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-32">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Trucking Parts & Components
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Quality parts for your fleet since 2020. Competitive pricing, fast
              delivery, expert service.
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
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
