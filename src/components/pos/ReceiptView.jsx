import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";

export default function ReceiptView({ receipt, change = 0, open, onClose }) {
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${receipt.id}`,
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <div className="space-y-4 font-mono text-sm" ref={receiptRef}>
          <div className="text-center space-y-1">
            <h2 className="font-bold text-lg">MRN POS</h2>
            <p className="text-muted-foreground">123 Chrysanthemum</p>
            <p className="text-muted-foreground">Camarin Caloocan, 1428</p>
            <p className="text-muted-foreground">Tel: (123) 123-4567</p>
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold">{receipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date: </span>
              <span>{receipt.date.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time: </span>
              <span>{receipt.date.toLocaleTimeString()}</span>
            </div>
          </div>
          {receipt.customerName && (
            <div className="flex justify-between">
              <span>Customer: </span>
              <span>{receipt.customerName}</span>
            </div>
          )}

          <Separator />

          <div className="space-y-1">
            {receipt.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <span className="flex-1">{item.name}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {item.qty} x {item.price.toFixed(2)}
                  </span>
                  <span>{(item.qty * item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <Separator />
          
          <div className="space-y-1">
            <div className="flex justify-between">
                <span>Subtotal: </span>
                <span>{receipt.subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        
      </DialogContent>
    </Dialog>
  );
}
