import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState({
        id: '1',
        name: 'Maron Fajardo',
        role: 'admin'
    })

    const toggleRole = () => {
        setUser((prev) => ({
            ...prev,
            role: prev.role === 'admin' ? 'cashier' : 'admin'
        }))
    }

    const isAdmin = user?.role === 'admin'
    const isCashier = user?.role === 'cashier'

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            isCashier,
            toggleRole
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }

    return context;
}