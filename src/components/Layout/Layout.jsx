import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  return (
    <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed}/>
        <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}/>
        <main className='flex-1 overflow-auto p-6'>
          {children}
        </main>
        </div>
    </div>
  )
}
