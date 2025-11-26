'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext()

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

let globalToastId = 0

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const [mounted, setMounted] = useState(false)
    const timeoutsRef = useRef({})

    useEffect(() => {
        setMounted(true)
        
        // Cleanup all timeouts on unmount
        return () => {
            Object.values(timeoutsRef.current).forEach(clearTimeout)
        }
    }, [])

    const addToast = (message, type = 'success') => {
        const id = ++globalToastId
        const newToast = { id, message, type }
        
        console.log('🎨 Adding toast:', newToast)
        
        setToasts(prev => [...prev, newToast])

        // Store timeout ID
        const timeoutId = setTimeout(() => {
            console.log('🎨 Auto-removing toast after 4 seconds:', id)
            setToasts(prev => prev.filter(t => t.id !== id))
            delete timeoutsRef.current[id]
        }, 4000)
        
        timeoutsRef.current[id] = timeoutId

        return id
    }

    const removeToast = (id) => {
        console.log('🎨 Manual remove toast:', id)
        if (timeoutsRef.current[id]) {
            clearTimeout(timeoutsRef.current[id])
            delete timeoutsRef.current[id]
        }
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const success = (message) => addToast(message, 'success')
    const error = (message) => addToast(message, 'error')
    const info = (message) => addToast(message, 'info')
    const warning = (message) => addToast(message, 'warning')

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
            {mounted && <ToastContainer toasts={toasts} removeToast={removeToast} />}
        </ToastContext.Provider>
    )
}

function ToastContainer({ toasts, removeToast }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>,
        document.body
    )
}

function Toast({ toast, onClose }) {
    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    }

    const iconColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
    }

    return (
        <div className={`${styles[toast.type]} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-start gap-3 animate-slide-in`}>
            <div className={`${iconColors[toast.type]} flex-shrink-0`}>
                {icons[toast.type]}
            </div>
            <p className="flex-1 font-medium text-sm">{toast.message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}