import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { restockProduct } from "../../../store/productSlice";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddStockDialog({ productId }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState("");

  const handleAddStock = async () => {
    if (!quantity || isNaN(quantity)) return;

    try {
      await axios.put(`http://localhost:5000/products/${productId}/stock`, {
        quantity: parseInt(quantity, 10),
      });
      dispatch(
        restockProduct({
          productId,
          quantity: parseInt(quantity, 10),
        })
      );

      toast.success("Stock updated successfully");
      setQuantity(""); // reset input
    } catch (err) {
      console.error(err);
      toast.error("Error updating stock");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-2 py-1 border rounded text-xs bg-green-700 text-white cursor-pointer"
        >
          + Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full border p-2 rounded"
          />
          <Button onClick={handleAddStock} className="w-full bg-green-700 text-white">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
