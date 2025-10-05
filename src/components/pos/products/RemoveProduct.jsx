import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { fetchProducts, removeProduct } from "../../../store/productSlice";
import toast from "react-hot-toast";
export default function RemoveProduct({productId, productName}) {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        }
        
      )
      if (!response.ok) {
        throw new Error(`Failed to remove product: ${productName}`);
      }
      dispatch(removeProduct(productId));
      dispatch(fetchProducts())
      toast.success(`"${productName}" removed successfully.`);

    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Error removing product.");
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          variant="outline"
          className="px-1 md:px-2 py-0.5 md:py-1 border rounded text-xs bg-red-700 text-white cursor-pointer hover:bg-gray-100 hover:text-black"
        >
          - Remove
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove <span className="font-bold">{productName}</span> ?</DialogTitle>
        </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
        <DialogFooter className="flex justify-end gap-2 mt-4">
            <DialogTrigger asChild>
                <Button variant="outline">
                    Cancel
                </Button>
            </DialogTrigger>
            <Button onClick={handleRemove} className="bg-red-700 text-white">
                Confirm Remove
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
