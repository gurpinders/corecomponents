'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ConfirmContext = createContext()

export function useConfirm() {
    return useContext(ConfirmContext)
}

export function ConfirmProvider({ children }) {
    const [dialog, setDialog] = useState(null)

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setDialog({
                title: options.title || 'Confirm Action',
                message: options.message || 'Are you sure?',
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'danger', // 'danger' or 'warning' or 'info'
                onConfirm: () => {
                    setDialog(null)
                    resolve(true)
                },
                onCancel: () => {
                    setDialog(null)
                    resolve(false)
                }
            })
        })
    }, [])

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {dialog && <ConfirmDialog dialog={dialog} />}
        </ConfirmContext.Provider>
    )
}

function ConfirmDialog({ dialog }) {
    const buttonStyles = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 text-white'
    }

    const iconColors = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in">
                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${dialog.type === 'danger' ? 'bg-red-100' : dialog.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
                        {dialog.type === 'danger' ? (
                            <svg className={`w-6 h-6 ${iconColors[dialog.type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className={`w-6 h-6 ${iconColors[dialog.type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {dialog.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {dialog.message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={dialog.onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {dialog.cancelText}
                        </button>
                        <button
                            onClick={dialog.onConfirm}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${buttonStyles[dialog.type]}`}
                        >
                            {dialog.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}