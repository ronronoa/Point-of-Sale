import React from 'react'

export default function StatCard({ children }) {
  return (
    <div className="flex-1 overflow-hidden relative">
        <main className="py-4 px-4 lg:px-8">
            <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 gap-5"
            >
                {children}
            </div>
        </main>
    </div>
  )
}

export function StatCardItem ({text, icon, value}) {
    return (
        <div 
        className='font-bold border dark:border-[#1f1f1f] dark:bg-[#1e1e1e] p-4 rounded-md shadow-md'
        >
            <div className="px-4 py-5 sm:p-6">
                <span className="flex items-center text-sm font-medium dark:text-gray-300">
                    <span className="mr-2">{icon}</span>
                    <span className="">{text}</span>
                </span>
                <p className="mt-2 text-xl font-bold">{value}</p>
            </div>
        </div>
    )
}
