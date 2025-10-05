import { Eye, EyeOff, Store } from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/Layout/ThemeToggle";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
  return (
    <>
      <div className="flex items-center justify-center min-h-screen relative">
        <nav className="absolute top-0 right-0 p-4">
          <ThemeToggle />
        </nav>
        <div className="w-full max-w-md space-y-8 p-6 text-center">
          {/* <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div> */}

          <div className="flex justify-center mb-3 flex-col items-center relative">
            <img 
            src="/public/POSIMLOGO.png" 
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
        </div>
      </div>
    </>
  );
}
