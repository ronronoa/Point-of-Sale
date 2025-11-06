import React, { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { selectTaxRate } from "../../store/selectors";

export default function ReceiptView({ receipt, open, onClose, amountEntered = 0 }) {
  const receiptRef = useRef(null);
  const { user } = useAuth();
  const taxRate = useSelector(selectTaxRate);

  const subtotal = parseFloat(receipt.subtotal) || 0;
  const tax = parseFloat(receipt.tax) || 0;
  const discount = parseFloat(receipt.discount) || 0;
  const total = parseFloat(receipt.total) || 0;
  const amountPaid = parseFloat(amountEntered) || 0;

  const calculatePriceWithTax = (basePrice) => {
    return basePrice * (1 + taxRate);
  };

  const change = receipt.paymentType === "cash"
    ? Math.max(amountPaid - total, 0)
    : 0;

  const handleManualPrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const newWindow = window.open("", "_blank", "width=400,height=600");

    newWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${receipt?.id || "receipt"}</title>
          <style>
            @media print {
              @page {
                size: 58mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 4mm;
                font-family: monospace;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
              }
            }

            body {
              font-family: monospace;
              font-size: 12px;
              width: 58mm;
              margin: 0 auto;
              color: #000;
            }

            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .separator {
              border-bottom: 1px dashed #000;
              margin: 8px 0;
            }
            .flex { display: flex; justify-content: space-between; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .border-top {
              border-top: 1px solid #000;
              margin-top: 6px;
              padding-top: 4px;
            }
            .footer {
              border-top: 1px dashed #000;
              margin-top: 10px;
              padding-top: 6px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    newWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <div ref={receiptRef} className="space-y-3 font-mono text-sm">
          <div className="text-center space-y-1">
            <h2 className="font-bold text-lg">POSIM</h2>
            <p className="text-muted-foreground">UCC CONGRESS</p>
            <p className="text-muted-foreground">Congressional Road, 1400</p>
            <p className="text-muted-foreground">Tel: (123) 123-4567</p>
          </div>

          <div className="separator" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold">{receipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(receipt.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{new Date(receipt.date).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Handled By:</span>
              <span>{user?.name || 'Cashier'}</span>
            </div>
          </div>

          {receipt.customerName && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{receipt.customerName}</span>
            </div>
          )}

          <div className="separator" />

          <div className="space-y-1">
            {receipt.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <span className="flex-1">{item.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {item.qty} x {(parseFloat(item.price) || 0).toFixed(2)}
                  </span>
                  <span>{(item.qty * (parseFloat(item.price) || 0)).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="separator" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vatable Sales:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount:</span>
              <span>{discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT amount:</span>
              <span>{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-top">
              <span>Total:</span>
              <span>{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="separator" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="capitalize">{receipt.paymentType}</span>
            </div>
            {receipt.paymentType === "cash" && (
              <>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>{change.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-2">
            <p>Thank you for shopping!</p>
            <p>Come again :)</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 border rounded cursor-pointer flex items-center gap-1"
            onClick={handleManualPrint}
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button className="px-4 py-2 border rounded cursor-pointer" onClick={onClose}>
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}