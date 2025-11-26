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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        
        fetchQuotes() // Refresh the list
    }

    return(
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold mb-8">Quote Requests</h1>
                {loading && (
                    <p className="text-center py-8">Loading parts...</p>
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
                {!loading && !error && quotes.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                    {/* 6 td cells here */}
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
                )}
            </div>
        </main>
        </AdminProtection>
    )
}