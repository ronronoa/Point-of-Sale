import React, { useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

export default function AddUser() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    date_registered: "",
    password: "",
    confirm_password: "",
    role: "cashier",
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.confirm_password) {
      toast.error("Password does not match.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      toast.success(res.data.message);
      setForm({
        username: "",
        first_name: "",
        last_name: "",
        address: "",
        date_registered: "",
        password: "",
        confirm_password: "",
        role: "cashier",
      });
      setOpen(false);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Error adding user");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-center" />
      <DialogTrigger asChild>
        <button className="px-4 py-2 border rounded bg-[#032f30] hover:bg-[#032122] text-white cursor-pointer transition-colors duration-200">
          + Add User
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add New User
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`w-full ${errors.username ? "border-red-500 focus:ring-red-500" : "focus:ring-[#032f30]"}`}
                />
                {errors.username ? (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    Username must contain letters only
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  required
                  value={form.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className={`w-full ${errors.first_name ? "border-red-500 focus:ring-red-500" : "focus:ring-[#032f30]"}`}
                />
                {errors.first_name ? (
                  <p className="text-red-500 text-xs">{errors.first_name}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    First name must contain letters only
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  required
                  value={form.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className={`w-full ${errors.last_name ? "border-red-500 focus:ring-red-500" : "focus:ring-[#032f30]"}`}
                />
                {errors.last_name ? (
                  <p className="text-red-500 text-xs">{errors.last_name}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    Last name must contain letters only
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={`w-full ${errors.address ? "border-red-500 focus:ring-red-500" : "focus:ring-[#032f30]"}`}
                />
                {errors.address ? (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    Letters, numbers, spaces, commas, periods, or dashes only
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`w-full pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-[#032f30]"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    Password must be at least 4 characters
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                    className="w-full pr-10 focus:ring-[#032f30]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role *
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="w-full focus:ring-[#032f30]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#032f30] hover:bg-[#032122] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#032f30]"
              onClick={() => toast.remove()}
            >
              Add User
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}