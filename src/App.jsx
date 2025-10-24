import Header from "./components/Layout/Header"
import Layout from "./components/Layout/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import Dashboard from "./pages/Dashboard"
import POS from "./pages/POS"
import Products from "./pages/Products"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import { Toaster } from "@/components/ui/sonner"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import User from "./pages/User/User"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchProducts } from "./store/productSlice"
import AddUser from "./pages/User/AddUser"
import LandingPage from "./pages/Landing/LandingPage"
import About from "./pages/Landing/About"
import Home from "./pages/Landing/Home"

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])
  return (
    <>
      <AuthProvider>
        <Router>
            <Routes>
              {/* <Route path="/login" element={<Navigate to="/login" />} /> */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute role="admin">
                <Layout>
                  <Dashboard />
                </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos" element={
                <ProtectedRoute>
                  <Layout>
                    <POS />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/user" element={
                <ProtectedRoute role="admin">
                  <Layout>
                    <User />
                  </Layout>
                </ProtectedRoute>
              }/>
              
              <Route path="/products" element={
                <ProtectedRoute role="admin">
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/add-user" element={
                    <AddUser />
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
