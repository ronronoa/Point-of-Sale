import { createContext, useContext, useEffect, useState } from "react";
import authService from "../../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = authService.getToken();
        const name = authService.getUserName();
        const role = authService.getUserRole();

        if (token && role && name) {
            setUser({
                name,
                role
            })
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, []);

    const login = async (username, password) => {
        try {
            const response  = await authService.login(username, password);
            const { token, role } = response;

            const name = username.charAt(0).toUpperCase() + username.slice(1)

            authService.setAuthData(token, role, name)

            setUser({
                name,
                role
            })
            setIsAuthenticated(true)

            return { role }
            
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        setIsAuthenticated(false)
    }

    const toggleRole = () => {
        if(user) {
            const newRole = user.role === 'admin' ? 'cashier' : 'admin'
            const updatedUser = { ...user, role: newRole }

            authService.setAuthData(authService.getToken(), newRole, user.name)
            setUser(updatedUser)
        }
    }

    const isAdmin = user?.role === 'admin'
    const isCashier = user?.role === 'cashier'

    if(loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            isCashier,
            isAuthenticated,
            login,
            logout,
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