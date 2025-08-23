import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({children, role}) {
    const { isAuthenticated, user } = useAuth()
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace />
    }

    if (role && user?.role !== role) {
        const redirectPath = user?.role === 'admin' ? '/dashboard' : '/pos'
        return <Navigate to={redirectPath} replace />
    }
  
    return children;
}
