'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function UnsubscribePage() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [customer, setCustomer] = useState(null)

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            handleUnsubscribe(token)
        } else {
            setError('Invalid unsubscribe link')
            setLoading(false)
        }
    }, [searchParams])

    const handleUnsubscribe = async (token) => {
        try {
            // Find customer by unsubscribe token
            const { data: customer, error: fetchError } = await supabase
                .from('customers')
                .select('*')
                .eq('unsubscribe_token', token)
                .single()

            if (fetchError || !customer) {
                setError('Invalid or expired unsubscribe link')
                setLoading(false)
                return
            }

            setCustomer(customer)

            // If already unsubscribed, just show message
            if (!customer.subscribed) {
                setSuccess(true)
                setLoading(false)
                return
            }

            // Update subscription status
            const { error: updateError } = await supabase
                .from('customers')
                .update({ subscribed: false })
                .eq('unsubscribe_token', token)

            if (updateError) {
                setError('Failed to unsubscribe. Please try again.')
                setLoading(false)
                return
            }

            setSuccess(true)
            setLoading(false)

        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {/* Logo/Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">CoreComponents</h1>
                </div>

                {loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Processing your request...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                            Return to Homepage
                        </Link>
                    </div>
                )}

                {success && (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">You've Been Unsubscribed</h2>
                        <p className="text-gray-600 mb-6">
                            {customer?.email && `We've removed ${customer.email} from our mailing list.`}
                            {!customer?.email && "You've been removed from our mailing list."}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            You will no longer receive promotional emails from CoreComponents. 
                            If this was a mistake, please contact us at info@ccomponents.ca
                        </p>
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                            Return to Homepage
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}