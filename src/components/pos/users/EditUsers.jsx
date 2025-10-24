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
import { Edit, Pencil } from "lucide-react";

export default function EditUsers({ user, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    imageFile: null,
    imagePreview: "/user-placeholder.png",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        address: user.address || "",
        imageFile: null,
        imagePreview: user.profile_image
          ? user.profile_image.startsWith("http")
            ? user.profile_image
            : `http://localhost:5000${user.profile_image}`
          : "/user-placeholder.png",
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.remove();

    try {
      const userId = user.user_id || user.id;
      if (!userId) {
        toast.error("Missing user ID.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("address", formData.address);
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/update/${userId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "User updated successfully");
      if (onUpdated) await onUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while updating."
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
          <div className="flex justify-center flex-col items-center">
            <label className="relative group cursor-pointer">
              <img
                src={formData.imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 transition-all hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Pencil className="text-white" size={16} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <p className="text-gray-500 text-xs font-medium">Click the image to change.</p>
          </div>

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
