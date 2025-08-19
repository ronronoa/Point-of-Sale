import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

export default function PrintDemo() {
  const printableRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Simple React-to-Print Demo</h1>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg shadow-sm border"
          >
            Print Invoice
          </button>
        </div>

        {/* Printable area */}
        <div ref={printableRef} className="bg-white rounded-lg shadow p-6">
          <header className="mb-4">
            <h2 className="text-xl font-medium">Invoice</h2>
            <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
          </header>

          <table className="w-full text-left mb-4">
            <thead>
              <tr>
                <th className="pb-2">Item</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>USB Cable</td>
                <td>2</td>
                <td>₱150.00</td>
                <td>₱300.00</td>
              </tr>
              <tr>
                <td>Mouse</td>
                <td>1</td>
                <td>₱450.00</td>
                <td>₱450.00</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div>
              <div className="text-sm">Subtotal: ₱750.00</div>
              <div className="text-lg font-semibold">Total: ₱750.00</div>
            </div>
          </div>

          <footer className="mt-6 text-xs text-gray-500">Thank you for your purchase!</footer>
        </div>
      </div>
    </div>
  )
}
