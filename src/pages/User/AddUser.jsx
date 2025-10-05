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

export default function AddUser() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    date_registered: "",
    password: "",
    role: "cashier",
  });
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
        role: "cashier",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding user");
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
