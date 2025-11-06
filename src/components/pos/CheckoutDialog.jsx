import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectGrandTotal,
  selectSubtotal,
  selectTaxAmount,
  selectDiscountAmount,
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
import { updateStock, updateProductStock, setProduct } from "../../store/productSlice";
import { clearCart } from "../../store/cartSlice";
import { setDiscountType } from "../../store/cartSlice";
import axios from "axios";

export default function CheckoutDialog({ open, onOpenChange, onComplete }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTaxAmount);
  const total = useSelector(selectGrandTotal);
  const discount = useSelector(selectDiscountAmount);
  const discountType = useSelector(selectDiscountType);
  const [paymentType, setPaymentType] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [pwdIdNumber, setPwdIdNumber] = useState("");
  const [pwdIdError, setPwdIdError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        dispatch(setProduct(res.data));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  const validatePwdId = (id) => {
    if (!id.trim()) {
      return "PWD ID is required";
    }

    const cleanId = id.replace(/\s/g, '').toUpperCase();
    
    const formatRegex = /^\d{3}-\d{7}$/;
    if (!formatRegex.test(cleanId)) {
      return "Invalid format. Use: BBB-NNNNNNN";
    }

    const parts = cleanId.split('-');
    const barangayCode = parts[0];
    const sequentialNumber = parts[1];

    const barangay = parseInt(barangayCode);
    if (barangay < 1 || barangay > 999) {
      return "Invalid barangay code (001-999)";
    }


    const sequential = parseInt(sequentialNumber);
    if (sequential < 1 || sequential > 9999999) {
      return "Invalid sequential number";
    }

    return "";
  };

  const formatPwdId = (input) => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else {
      return `${digits.substring(0, 3)}-${digits.substring(3, 10)}`;
    }
  };

  const handlePwdIdChange = (e) => {
    const rawInput = e.target.value;
    const formatted = formatPwdId(rawInput);
    setPwdIdNumber(formatted);
    
    if (formatted.length === 11) {
      const error = validatePwdId(formatted);
      setPwdIdError(error);
    } else {
      if (formatted.length > 0 && formatted.length < 11) {
        setPwdIdError("Incomplete format. Use: BBB-NNNNNNN");
      } else {
        setPwdIdError("");
      }
    }
  };

  const validateAmount = (value) => {
    const amount = parseFloat(value) || 0;
    
    if (value === "") {
      setAmountError("");
      return true;
    }
    
    if (amount < 0) {
      setAmountError("Amount cannot be negative");
      return false;
    }
    
    if (amount > 50000) {
      setAmountError("Amount cannot exceed ₱50,000");
      return false;
    }
    
    if (paymentType === "cash" && amount < total) {
      setAmountError("Insufficient amount");
      return false;
    }
    
    setAmountError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmountPaid(value);
    validateAmount(value);
  };

  const handleDiscountTypeChange = (e) => {
    const value = e.target.value || null;
    dispatch(setDiscountType(value));
    
    if (value !== "PWD") {
      setPwdIdNumber("");
      setPwdIdError("");
    }
  };

  const handleCheckout = async () => {

    if (discountType === "PWD") {
      if (!pwdIdNumber.trim()) {
        toast.error("Please enter PWD ID number");
        return;
      }

      const pwdError = validatePwdId(pwdIdNumber);
      if (pwdError) {
        toast.error(pwdError);
        return;
      }
    }

    if (paymentType === "cash") {
      const paid = parseFloat(amountPaid) || 0;
      
      if (!amountPaid || amountPaid === "") {
        toast.error("Please enter amount paid");
        return;
      }
      
      if (paid < total) {
        toast.error("Insufficient Amount");
        return;
      }
      
      if (paid > 50000) {
        toast.error("Amount cannot exceed ₱50,000");
        return;
      }
      
      if (!validateAmount(amountPaid)) {
        return;
      }
    }

    try {
      for (const item of items) {
        const response = await fetch(
          `http://localhost:5000/products/checkout`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: item.id,
              quantity: item.qty,
            }),
          }
        );

        const fetchStock = await axios.get("http://localhost:5000/products")
        dispatch(setProduct(fetchStock.data))

        if (!response.ok) {
          throw new Error(`Checkout failed for ${item.name}`);
        }
      }
      toast.success("Checkout successful!");

      const newReceipt = {
        id: `RCP-${Date.now()}`,
        date: new Date(),
        items: [...items],
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        paymentType,
        customerName: customerName || undefined,
        amountPaid: paymentType === "cash" ? parseFloat(amountPaid) : total,
        discountType,
        pwdIdNumber: discountType === "PWD" ? pwdIdNumber : undefined,
      };

      setReceipt(newReceipt);
      setShowReceipt(true);

      dispatch(clearCart());
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error processing checkout.");
    }
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setReceipt(null);
    setCustomerName("");
    setAmountPaid("");
    setPaymentType("cash");
    setAmountError("");
    setPwdIdNumber("");
    setPwdIdError("");
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
        amountEntered={amountPaid}
        open={showReceipt}
        onClose={handleReceiptClose}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
                <span className="flex items-center">
                  <PhilippinePeso size={12} />
                  {discount.toFixed(2)}
                </span>
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
                  onChange={handleDiscountTypeChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200 w-full cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="PWD">
                    PWD / Senior Citizen (20% + Tax exempt)
                  </option>
                </select>

                {discountType === "PWD" && (
                  <div className="space-y-2">
                    <label className="font-semibold text-sm">
                      PWD/Senior Citizen ID Number *
                    </label>
                    <input
                      type="text"
                      value={pwdIdNumber}
                      onChange={handlePwdIdChange}
                      placeholder="BBB-NNNNNNN"
                      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-1 transition duration-200 w-full uppercase ${
                        pwdIdError 
                          ? "border-red-500 focus:ring-red-500" 
                          : pwdIdNumber && !pwdIdError && pwdIdNumber.length === 11
                          ? "border-green-500 focus:ring-green-500"
                          : "focus:ring-gray-500"
                      }`}
                      maxLength={11}
                      required
                    />
                    
                    {pwdIdError && (
                      <p className="text-sm text-red-500 font-medium">
                        {pwdIdError}
                      </p>
                    )}
                    
                    {pwdIdNumber && !pwdIdError && pwdIdNumber.length === 11 && (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Valid PWD ID format
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Format: BBB-NNNNNNN<br/>
                      • BBB: Barangay code (001-999)<br/>
                      • NNNNNNN: Sequential number (7 digits)
                    </p>
                  </div>
                )}
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
                    min="0"
                    max="50000"
                    value={amountPaid}
                    onChange={handleAmountChange}
                    className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200 ${
                      amountError ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  
                  {amountError && (
                    <p className="text-sm text-red-500 font-medium">
                      {amountError}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Maximum allowed amount: ₱50,000
                  </p>

                  {amountPaid && !amountError && (
                    <p className="text-sm text-green-600 font-medium">
                      Change: ₱{change.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  className="px-4 py-2 border rounded-md bg-red-500 text-white font-semibold cursor-pointer flex-1 hover:bg-red-600 transition duration-200"
                  onClick={() => {
                    setAmountError("");
                    setPwdIdNumber("");
                    setPwdIdError("");
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className={`px-4 py-2 border rounded-md text-white font-semibold cursor-pointer flex-1 transition duration-200 ${
                    (paymentType === "cash" && amountError) || 
                    (discountType === "PWD" && (pwdIdError || !pwdIdNumber.trim() || pwdIdNumber.length !== 11))
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-[#0F172A] hover:bg-[#1e293b]"
                  }`}
                  onClick={() => handleCheckout(toast.remove())}
                  disabled={
                    (paymentType === "cash" && amountError) || 
                    (discountType === "PWD" && (pwdIdError || !pwdIdNumber.trim() || pwdIdNumber.length !== 11))
                  }
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