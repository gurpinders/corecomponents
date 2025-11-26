'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminProtection({ children }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        async function checkAdmin() {
            // First check if user is logged in
            const { data: { session } } = await supabase.auth.getSession()
            
            if (!session) {
                router.push('/login')
                return
            }

            // Then check if user is admin
            const { data: customer } = await supabase
                .from('customers')
                .select('is_admin')
                .eq('email', session.user.email)
                .single()

            if (!customer || !customer.is_admin) {
                // Not an admin - redirect to homepage
                alert('Access denied. Admin privileges required.')
                router.push('/')
                return
            }

            setIsAdmin(true)
            setLoading(false)
        }

        checkAdmin()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600">Verifying admin access...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return <>{children}</>
}