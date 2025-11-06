import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function RemoveUser({ userId, onUserRemoved }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    toast.remove()
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/users/archived/${userId}`);
      toast.success("User Removed Successfully.")
      setLoading(false);
      setOpen(false);
    
      if (onUserRemoved) onUserRemoved(userId); // callback to refresh user list
    } catch (error) {
        toast.error(error.response?.message)
      console.error("Error deleting user:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <Toaster position="top-center"/>
      <DialogTrigger asChild>
        <button className="text-red-500 cursor-pointer hover:scale-105 transition duration-200">
          <Trash2 size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm flex flex-col">
            <span>Are you sure you want to delete this user?</span>
            <span className="text-gray-500">This action cannot be undone!</span>
          </p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-gray-100 border rounded-lg text-black cursor-pointer flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 border rounded-lg text-white cursor-pointer flex-1 flex items-center justify-center gap-2 group ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 transition"
              }`}
            >
              <Trash2
                size={18}
                className={`transition duration-200 opacity-0 ${
                  loading ? "opacity-0" : "group-hover:opacity-100"
                }`}
              />
              <span
                className={`transition duration-200 ${
                  loading ? "" : "-translate-x-3 group-hover:translate-x-0"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
