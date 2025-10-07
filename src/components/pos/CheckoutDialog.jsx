import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectGrandTotal,
  selectSubtotal,
  selectTaxAmount,
  selectDiscountAmount,
  selectDiscount,
  selectDiscountType,
} from "../../store/selectors";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhilippinePeso } from "lucide-react";
import ReceiptView from "./ReceiptView";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { updateStock, updateProductStock } from "../../store/productSlice";
import { clearCart } from "../../store/cartSlice";
import { setDiscountType } from "../../store/cartSlice";

export default function CheckoutDialog({ open, onOpenChange, onComplete }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTaxAmount);
  const total = useSelector(selectGrandTotal);
  const discount = useSelector(selectDiscount);
  const discountType = useSelector(selectDiscountType);
  const [paymentType, setPaymentType] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleCheckout = async () => {
  const paid = parseFloat(amountPaid) || 0;

  if (paymentType === "cash" && paid < total) {
    toast.error("Insufficient Amount");
    return;
  }

  try {
    for (const item of items) {
  const response = await fetch(`http://localhost:5000/products/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: item.id,
      quantity: item.qty,
    }),
  });

  if (!response.ok) {
    throw new Error(`Checkout failed for ${item.name}`);
  }
}
      toast.success("Checkout successful!")

    const newReceipt = {
      id: `RCP-${Date.now()}`,
      date: new Date(),
      items: [...items],
      subtotal,
      tax,
      discount,
      total,
      paymentType,
      customerName: customerName || undefined,
    };

    setReceipt(newReceipt);
    setShowReceipt(true);

    dispatch(clearCart());
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error("Error processing checkout.");
  }

  // try {
  //   for (const item of items) {
  //     const response = await fetch(
  //       `http://localhost:5000/products/${item.id}/reduce-stock`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ quantity: item.qty }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Failed to update stock for ${item.name}`);
  //     }
  //   }

  //   toast.success("Checkout Successful and stock updated.");

  //   // ✅ Generate receipt
  //   const newReceipt = {
  //     id: `RCP-${Date.now()}`,
  //     date: new Date(),
  //     items: [...items],
  //     subtotal,
  //     tax,
  //     discount,
  //     total,
  //     paymentType,
  //     customerName: customerName || undefined,
  //   };

  //   setReceipt(newReceipt);
  //   setShowReceipt(true);

  //   // dispatch(updateProductStock({ id: item.id, newStock: product.stock - item.qty}))

  //   // ✅ Clear cart from Redux
  //   dispatch(clearCart());
  // } catch (error) {
  //   console.error("Checkout error:", error);
  //   toast.error("Error updating stock or completing checkout.");
  // }
};


  const handleReceiptClose = () => {
    setShowReceipt(false);
    setReceipt(null);
    setCustomerName("");
    setAmountPaid("");
    setPaymentType("cash");
    onComplete();
  };

  const change =
    paymentType === "cash"
      ? Math.max(0, (parseFloat(amountPaid) || 0) - total)
      : 0;
  if (showReceipt && receipt) {
    return (
      <ReceiptView
        receipt={receipt}
        // change={change}
        amountEntered={amountPaid}
        open={showReceipt}
        onClose={handleReceiptClose}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent classname="max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div className="flex justify-between" key={item.id}>
                  <span>
                    {item.name} x{item.qty}
                  </span>
                  <span className="flex items-center">
                    <PhilippinePeso size={12} />
                    {item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="flex items-center">
                  <PhilippinePeso size={12} />
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount:</span>
                <span>{discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="flex items-center">
                  <PhilippinePeso size={12} />
                  {tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total:</span>
                <span className="flex items-center font-semibold">
                  <PhilippinePeso size={12} />
                  {total.toFixed(2)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-xs md:text-sm">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  id="customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-3">
                <label className="font-semibold">Discount Type</label>
                <select
                  value={discountType || ""}
                  onChange={(e) =>
                    dispatch(setDiscountType(e.target.value || null))
                  }
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200 w-full cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="PWD">PWD / Senior Citizen (20% + Tax exempt)</option>
                </select>
              </div>

              {/* Payment Type */}
              <div className="space-y-3">
                <label className="font-semibold">Payment Method</label>
                <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <label htmlFor="cash">Cash</label>
                  </div>
                </RadioGroup>
              </div>

              {paymentType === "cash" && (
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="amount" className="font-semibold">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    id="amount"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200"
                  />

                  {amountPaid && (
                    <p className="text-sm text-muted-foreground">
                      Change: {change.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 border rounded-md bg-red-500 text-white font-semibold cursor-pointer flex-1 hover:bg-red-600"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 border rounded-md bg-[#0F172A] text-white font-semibold cursor-pointer flex-1"
                  onClick={() => handleCheckout(toast.remove())}
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
