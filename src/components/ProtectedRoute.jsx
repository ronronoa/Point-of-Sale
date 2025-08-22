import React from 'react'
import { Navigate } from 'react-router'

export default function ProtectedRoute({children, role}) {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("role")

    if(!token) return <Navigate to="/login" />
    if (role && role !== userRole) return <Navigate to="/unauthorized" />
  
    return children;
}
