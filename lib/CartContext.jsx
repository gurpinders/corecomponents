'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getUser } from './auth'
import { supabase } from './supabase'

// Create the Context (shared backpack)
const CartContext = createContext()

// Hook to use the cart in any component
export function useCart() {
    return useContext(CartContext)
}

// Provider component that wraps your app
export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [user, setUser] = useState(null)

    // Load cart from localStorage and check user status on mount
    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }

        // Check if user is logged in
        checkUser()
    }, [])

    // Check authentication status AND admin status
    const checkUser = async () => {
        const { user: authUser } = await getUser()
        
        if (authUser) {
            // Fetch customer data including is_admin
            const { data: customer } = await supabase
                .from('customers')
                .select('email, name, is_admin')
                .eq('email', authUser.email)
                .single()
            
            // Merge auth user with customer data
            setUser({
                ...authUser,
                is_admin: customer?.is_admin || false
            })
        } else {
            setUser(null)
        }
    }

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Add item to cart
    const addToCart = (part, quantity = 1) => {
        setCart(currentCart => {
            // Check if item already in cart
            const existingItem = currentCart.find(item => item.id === part.id)
            
            if (existingItem) {
                // Update quantity if already in cart
                return currentCart.map(item =>
                    item.id === part.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Add new item to cart
                // Determine which price to use based on login status
                const price = user ? part.customer_price : part.retail_price
                
                return [...currentCart, {
                    id: part.id,
                    name: part.name,
                    sku: part.sku,
                    price: price,
                    retail_price: part.retail_price,
                    customer_price: part.customer_price,
                    quantity: quantity,
                    images: part.images
                }]
            }
        })
    }

    // Remove item from cart
    const removeFromCart = (partId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== partId))
    }

    // Update quantity of item in cart
    const updateQuantity = (partId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(partId)
            return
        }
        
        setCart(currentCart =>
            currentCart.map(item =>
                item.id === partId
                    ? { ...item, quantity: quantity }
                    : item
            )
        )
    }

    // Clear entire cart
    const clearCart = () => {
        setCart([])
        localStorage.removeItem('cart')
    }

    // Calculate cart totals
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0)
    }

    // Get number of items in cart
    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    // Calculate savings (if logged in)
    const getCartSavings = () => {
        if (!user) return 0
        
        return cart.reduce((savings, item) => {
            const retailTotal = item.retail_price * item.quantity
            const customerTotal = item.customer_price * item.quantity
            return savings + (retailTotal - customerTotal)
        }, 0)
    }

    const value = {
        cart,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartSavings,
        checkUser // Allow components to refresh user status
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}