import { ChevronLeft, Eye, EyeOff, Store } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/Layout/ThemeToggle";
import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeProvider";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const { theme } = useTheme()

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.role === "admin") {
        navigate("/dashboard");
      } else if (result.role === "cashier") {
        navigate("/pos");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <img
            src="/public/posimlogo.png"
            alt="POSIM Logo"
            className="w-40 h-auto object-contain mb-6"
          />
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-gray-300 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <nav className="absolute top-0 left-0 p-4">
          <NavLink 
          to="/"
          className="px-4 py-2 border rounded-full flex bg-[#032F30] text-white cursor-pointer group">
            <span className="opacity-0 group-hover:opacity-100 transition duration-200">
              <ChevronLeft />  
            </span>
            <span className="">Back to Landing Page</span>
          </NavLink>
        </nav>
        <nav className="absolute top-0 right-0 p-4">
            <ThemeToggle />
        </nav>
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md space-y-8 p-6 text-center">
          {/* <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div> */}

          <div className="flex justify-center mb-3 flex-col items-center relative">
            <img 
            src={theme === 'dark' ? '/posimlogo_dark.png' : '/posimlogo.png'}
            alt="POSIM Logo" 
            className="w-32 h-auto md:w-40 object-contain"
            />
            <p className="text-muted-foreground absolute bottom-0">Sign in to your account.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the system.
                {error && (
                  <p className="text-red-500 text-center mb-3">{error}</p>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Label> Username </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="relative space-y-2">
                  <Label> Password </Label>
                  <Input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-7 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20}/> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded border w-full bg-[#032f30] text-white 
                          cursor-pointer mt-2 
                          flex justify-center items-center gap-2 ${
                            loading ? "disabled:opacity-50" : ""
                          }`}
                >
                  Login
                  {loading && (
                    <span className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"></span>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
