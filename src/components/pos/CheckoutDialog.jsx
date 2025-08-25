import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectGrandTotal,
  selectSubtotal,
  selectTaxAmount,
} from "../../store/selectors";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PhilippinePeso } from "lucide-react";
import ReceiptView from "./ReceiptView";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { updateStock } from '../../store/productSlice'
import { clearCart } from "../../store/cartSlice";

export default function CheckoutDialog({ open, onOpenChange, onComplete }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTaxAmount);
  const total = useSelector(selectGrandTotal);
  const [paymentType, setPaymentType] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const products = useSelector((state) => state.products.products)

  const change = paymentType === 'cash' ? Math.max(0, (parseFloat(amountPaid) || 0) - total) : 0;

  const handleCheckout = () => {
    const paid = parseFloat(amountPaid) || 0;

    if(paymentType === 'cash' && paid < total){
      toast.custom((t) => (
      <AnimatePresence>
        {t.visible && (
          <motion.div 
          className="bg-[#EF4444] px-6 py-4 w-72 rounded-lg shadow-md"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 20}}
          transition={{duration: 0.3}}
          >
            <div className="flex items-center">
              <img
                src="/Product_Image/multiply.png"
                alt=""
                className="w-5 h-5 mb-2 mr-2"
              />
              <p className="text-white text-md mb-2">
                Insufficient Amount
              </p>
            </div>
            <p className="text-gray-50 text-sm flex items-center">
              <PhilippinePeso size={12}/>{`${paid.toFixed(2)} is less than a total (₱${total.toFixed(2)})`}</p>
          </motion.div>
        )}
      </AnimatePresence>
    ),
   // toast duration
    {
      duration: 2000,
    }
  );
      return;
    }

    items.forEach(item => {
      dispatch(updateStock({productId: item.id, quantity: item.qty}))
    })

    const newReceipt = {
      id: `RCP-${Date.now()}`,
      date: new Date(),
      items: [...items],
      subtotal,
      tax,
      discount: 0,
      total,
      paymentType,
      customerName: customerName || undefined
    }

    setReceipt(newReceipt)
    setShowReceipt(true)
    dispatch(clearCart())
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    setReceipt(null)
    setCustomerName('')
    setAmountPaid('')
    setPaymentType('cash')
    onComplete()
  }


  if (showReceipt && receipt) {
    return (
      <ReceiptView 
        receipt={receipt}
        change={change}
        open={showReceipt}
        onClose={handleReceiptClose}
      />
    )
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
                <PhilippinePeso size={12}/>
                {subtotal.toFixed(2)}
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
                <PhilippinePeso size={12}/>
                {total.toFixed(2)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-xs md:text-sm">Customer Name (Optional)</label>
              <input 
              type="text" 
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200"
              />
            </div>

            {/* Payment Type */}
            <div className="space-y-3">
              <label className="font-semibold">Payment Method</label>
              <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id='cash' />
                    <label htmlFor="cash">Cash</label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id='card' />
                  <label htmlFor="card">Card</label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital" id='digital' />
                  <label htmlFor="digital">Digital</label>
                </div>
              </RadioGroup>
            </div>

            {paymentType === 'cash' && (
              <div className="space-y-2 flex flex-col">
                <label htmlFor="amount" className="font-semibold">Amount Paid</label>
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
