import Header from "./components/Layout/Header"
import Layout from "./components/Layout/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard"
import POS from "./pages/POS"
import Products from "./pages/Products"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import { Toaster } from "@/components/ui/sonner"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import AddUser from "./pages/AddUser"

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
            <Routes>
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

              <Route path="/add-user" element={
                <AddUser />
              }/>
              <Route path="/products" element={<Products />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
