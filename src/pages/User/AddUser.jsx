import React, { useRef, useState } from "react";
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
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (form.password !== form.confirm_password) {
      toast.error("Password does not match.")
      return
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
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage(err.response?.data?.message || "Error adding user");
        toast.error(err.response?.data?.message || "Error adding user");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-center" />
      <DialogTrigger asChild>
        <button className="px-4 py-2 border rounded bg-[#032f30] hover:bg-[#032122] text-white cursor-pointer">
          + Add User
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="my-2 items-center">
          <DialogTitle className="text-2xl">Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label> Username</Label>
            <Input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={`${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username ? (
              <p className="text-red-500 text-xs">{errors.username}</p>
            ) : (
              <p className="text-gray-400 text-xs">
                Username must contain letters only.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label> First Name </Label>
            <Input
              type="text"
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className={`${errors.first_name ? "border-red-500" : ""}`}
            />
            {errors.first_name ? (
              <p className="text-red-500 text-xs">{errors.first_name}</p>
            ) : (
              <p className="text-gray-400 text-xs">
                First Name must contain letters only.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label> Last Name </Label>
            <Input
              type="text"
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className={`${errors.last_name ? "border-red-500" : ""}`}
            />
            {errors.last_name ? (
              <p className="text-red-500 text-xs">{errors.last_name}</p>
            ) : (
              <p className="text-gray-400 text-xs">
                Last Name must contain letters only.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label> Address </Label>
            <Input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address ? (
              <p className="text-red-500 text-xs">{errors.address}</p>
            ) : (
              <p className="text-gray-400 text-xs">
                Address must contain only letters, numbers, spaces, commas,
                periods, or dashes.
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label> Password </Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password ? (
              <p className="text-red-500 text-xs">{errors.password}</p>
            ) : (
              <p className="text-gray-400 text-xs">
                Password must be at least 4 characters.
              </p>
            )}

            <div className="space-y-2 relative">
              <Label> Confirm Password </Label>
              <Input 
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value})}
              />
              <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-7 right-3 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18}/>}
              </button>
            </div>

            <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-7 right-3 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          <Label> Role </Label>
          <Select
            value={form.role}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="submit"
            className="px-4 py-2 rounded border w-full bg-[#032f30] text-muted cursor-pointer mt-2"
            onClick={() => toast.remove()}
          >
            Add User
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
