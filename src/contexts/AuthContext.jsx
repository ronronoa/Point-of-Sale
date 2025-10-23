import { createContext, useContext, useEffect, useState } from "react";
import authService from "../../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        const name = authService.getUserName();
        const role = authService.getUserRole();

        if (token) {
            if (userData) {
                setUser(userData);
            } else if (role && name) {
                setUser({
                    name,
                    role,
                    first_name: '',
                    last_name: '',
                    address: '',
                    username: '',
                });
            }
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            console.log("Login Response:", response);
            const { token, role, user_id, id } = response;

            const name = username.charAt(0).toUpperCase() + username.slice(1);

            const userData = {
                user_id: user_id ?? null,
                id: id ?? null,
                name,
                username: response.username,
                first_name: response.first_name || '',
                last_name: response.last_name || '',
                address: response.address || '',
                role: role
            };

            authService.setAuthData(token, role, name, userData);

            setUser(userData);
            setIsAuthenticated(true);

            return { role };
            
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }

    const updateUserData = (updatedData) => {
        const updatedUser = {
            ...user,
            ...updatedData
        };
        
        setUser(updatedUser);
        
        const token = authService.getToken();
        const role = authService.getUserRole();
        const name = authService.getUserName();
        authService.setAuthData(token, role, name, updatedUser);
    }

    const toggleRole = () => {
        if(user) {
            const newRole = user.role === 'admin' ? 'cashier' : 'admin';
            const updatedUser = { ...user, role: newRole };

            authService.setAuthData(authService.getToken(), newRole, user.name, updatedUser);
            setUser(updatedUser);
        }
    }

    const isAdmin = user?.role === 'admin';
    const isCashier = user?.role === 'cashier';

    if(loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            isCashier,
            isAuthenticated,
            login,
            logout,
            toggleRole,
            updateUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}