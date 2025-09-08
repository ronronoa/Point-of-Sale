import { Store } from "lucide-react";
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
  // const [form, setForm] = useState({username: "", password: ""})
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // const usernamePattern = "^[a-zA-Z0-9]{3,16}+$"
  // const validationForm = () => {
  //     if(!form.username.match(usernamePattern)){
  //         setError("Username should have minimum of 3 characters and maximum of 16 characters A-Z, 0-9")
  //         return false;
  //     }

  //     if(!form.username.trim() || !form.password.trim()){
  //         setError("Username and password are required")
  //         return false
  //     }

  //     setError("")
  //     return true;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(!validationForm()) return
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
        <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
          <Store className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold mb-4">RNPOS</h1>
        <p className="text-muted-foreground">Sign in to your account.</p>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the system.
              {error && <p className="text-red-500 text-center mb-3">{error}</p>}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <label htmlFor="username" className='relative'>
                            <input 
                            type="text" 
                            className='px-4 py-2 border text-sm outline-none 
                                    border-gray-400 rounded hover:border-gray-600 duration-200 peer 
                                    focus:ring focus:ring-gray-500 bg-inherit'/>
                            <span className="absolute top-0 left-0 px-1 text-sm text-muted-foreground 
                                            pointer-events-none peer-focus:text-indigo-500 duration-200 
                                            peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2"
                            >
                                Username
                            </span>
                       </label> */}

              <Label> Username </Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Label> Password </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

                <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded border w-full bg-[#032f30] text-white 
                          cursor-pointer mt-2 
                          flex justify-center items-center gap-2 ${loading ? "disabled:opacity-50" : ""}`}
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
