'use client'

import { useCart } from '@/lib/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, getCartTotal, getCartSavings, user } = useCart()

    if (cart.length === 0) {
        return (
            <div>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
                        <Link href="/catalog" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800">
                            Browse Catalog
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const subtotal = getCartTotal()
    const tax = subtotal * 0.13 // 13% HST for Ontario
    const total = subtotal + tax
    const savings = getCartSavings()

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                {cart.map((item) => (
                                    <div key={item.id} className="p-6 border-b last:border-b-0 flex gap-6">
                                        {/* Image */}
                                        <div className="w-24 h-24 flex-shrink-0">
                                            {item.images && item.images[0] ? (
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded"></div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                            {item.sku && <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>}
                                            
                                            {/* Price */}
                                            <div className="mb-3">
                                                {user && item.customer_price < item.retail_price ? (
                                                    <div>
                                                        <p className="text-sm text-gray-500 line-through">
                                                            ${item.retail_price}
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            ${item.customer_price}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-lg font-bold">${item.price}</p>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {user && savings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>You Save</span>
                                            <span className="font-medium">-${savings.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (HST 13%)</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full bg-black text-white text-center px-6 py-4 rounded-lg font-bold hover:bg-gray-800 mb-3"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/catalog"
                                    className="block w-full text-center text-gray-600 hover:text-black font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}