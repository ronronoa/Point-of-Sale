import React from 'react'
import { Sun, Moon, Menu, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onToggleSidebar }) {
    const { user, toggleRole} = useAuth()
  return (
    <header className="h-12 border-b px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button className="h-8 w-8 p-0"
            onClick={onToggleSidebar}
            >
                <Menu size={18}/>
            </button>

            <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200">
                    <User size={18}/>
                </div>
                <span className="text-sm font-medium hidden md:block">{user.name}</span>

                <button 
                className="px-4 py-1 text-xs text-white font-semibold border rounded-full cursor-pointer bg-black"
                onClick={toggleRole}
                >
                    {user.role}
                </button>

                <div className='hidden md:block'>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    </header>
  )
}
