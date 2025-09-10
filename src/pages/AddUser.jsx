import React, { useRef, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

export default function AddUser() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    password: "",
    role: "cashier",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      toast.success(res.data.message)
      setForm({ username: "", first_name: "", last_name: "", address: "", password: "", role: "cashier" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding user")
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-center"/>
      <div className="w-full max-w-md space-y-8 p-6 text-center">
        <div className="h-12 w-12 mx-auto rounded-lg bg-primary flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold mb-4">New user</h1>
        
        <p className="text-muted-foreground">Add new user</p>

        <Card>
          <CardHeader>
            <CardTitle>MRN</CardTitle>
            <CardDescription>
              Register new user to access the system.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label> Username</Label>
              <Input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <Label> First Name </Label>
              <Input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />

              <Label> Last Name </Label>
              <Input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />

              <Label> Address </Label>
              <Input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <Label> Password </Label>
              <Input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

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
              >
                Add User
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
