'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function AdminQuotesPage(){
    const [quotes, setQuotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]= useState(null)

    const router = useRouter();

    const fetchQuotes = async() => {
        const { data, error } = await supabase.from('quote_requests').select('*, parts(name)').order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setQuotes(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchQuotes();
    }, [])

    const handleStatusUpdate = async (quoteId, newStatus) => {
        const { error } = await supabase
            .from('quote_requests')
            .update({ status: newStatus })
            .eq('id', quoteId)
        
        if (error) {
            alert('Error updating status: ' + error.message)
            return
        }
        
        fetchQuotes()
    }

    return(
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold mb-8">Quote Requests</h1>

                {loading && (
                    <p className="text-center py-8">Loading quotes...</p>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && quotes.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No quote requests yet.
                    </p>
                )}

                {/* DESKTOP: Quotes Table */}
                {!loading && !error && quotes.length > 0 && (
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Part
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {quotes.map((quote) => (
                                    <tr key={quote.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">{quote.customer_name}</div>
                                                <div className="text-gray-500">{quote.customer_email}</div>
                                                {quote.customer_company && (
                                                    <div className="text-gray-500">{quote.customer_company}</div>
                                                )}
                                                {quote.customer_phone && (
                                                    <div className="text-gray-500">{quote.customer_phone}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {quote.parts?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {quote.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs truncate">
                                                {quote.message || 'No message'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={quote.status}
                                                onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-black ${
                                                    quote.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    quote.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                    quote.status === 'quoted' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="quoted">Quoted</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MOBILE: Quotes Cards */}
                {!loading && !error && quotes.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {quotes.map((quote) => (
                            <div key={quote.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-900 text-lg">{quote.customer_name}</h3>
                                    <span className="text-xs text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-3 border-t pt-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-gray-600">Email:</span>
                                        <span className="text-sm text-gray-900 text-right break-all">{quote.customer_email}</span>
                                    </div>

                                    {quote.customer_company && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Company:</span>
                                            <span className="text-sm text-gray-900">{quote.customer_company}</span>
                                        </div>
                                    )}

                                    {quote.customer_phone && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Phone:</span>
                                            <span className="text-sm text-gray-900">{quote.customer_phone}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Part:</span>
                                        <span className="text-sm text-gray-900">{quote.parts?.name || 'N/A'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Quantity:</span>
                                        <span className="text-sm text-gray-900">{quote.quantity}</span>
                                    </div>

                                    {quote.message && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 block mb-1">Message:</span>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{quote.message}</p>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-sm font-medium text-gray-600 block mb-2">Status:</span>
                                        <select
                                            value={quote.status}
                                            onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                                            className={`w-full text-sm font-semibold rounded-lg px-3 py-2 border-2 focus:ring-2 focus:ring-black ${
                                                quote.status === 'new' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                quote.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                quote.status === 'quoted' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="quoted">Quoted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
        </AdminProtection>
    )
}