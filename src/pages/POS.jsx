import React from "react";
import ProductGrid from "../components/pos/ProductGrid";
import Cart from "../components/pos/Cart";

export default function POS() {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-full">
            <ProductGrid />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Cart />
        </div>
      </div>
  );
}
