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
import { removeProduct } from "../../../store/productSlice";
export default function RemoveProduct({productId, productName}) {
  const dispatch = useDispatch();
  const handleRemove = () => {
    dispatch(removeProduct(productId))
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          variant="outline"
          className="px-2 py-1 border rounded text-xs bg-red-700 text-white cursor-pointer hover:bg-gray-100 hover:text-black"
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
