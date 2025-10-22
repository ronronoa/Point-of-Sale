// src/components/pos/users/EditUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function EditUsers({ user, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        address: user.address || "",
      });
    }
    if (user && !open) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        address: user.address || "",
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.remove();

    try {
      const userId = user.user_id || user.id;
      if (!userId) {
        toast.error("No user selected or missing user ID.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/update/${userId}`,
        formData
      );

      toast.success(res.data.message || "User updated successfully.");
      if (onUpdated) await onUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while updating the user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button aria-label="Edit user">
          <Edit
            size={20}
            className="text-blue-500 hover:scale-105 transition duration-200 cursor-pointer"
          />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
