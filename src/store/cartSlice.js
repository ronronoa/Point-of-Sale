import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  items: [],
  discount: 0, //
  discountType: null,
  taxRate: 0.12,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      const priceWithTax = product.price * (1 + state.taxRate)

      if (existingItem) {
        existingItem.qty += qty;
        existingItem.subtotal = existingItem.qty * priceWithTax;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: priceWithTax,
          basePrice: product.price,
          taxRate: state.taxRate,
          qty,
          subtotal: qty * priceWithTax,
        });
      }
    },

    updateTaxRate: (state, action) => {
      state.taxRate = action.payload;
    },

    updateQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item && qty > 0) {
        item.qty = qty;
        item.subtotal = item.price * qty;
      } else {
        state.items = state.items.filter((item) => item.id !== productId);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },

    setTaxRate: (state, action) => {
      state.taxRate = action.payload;
    },

    applyDiscount: (state, action) => {
      state.discount = action.payload;
    },

    setDiscountType: (state, action) => {
      const type = action.payload;

      if (type === "PWD" || type === "SENIOR") {
        state.discountType = type;
        state.discount = 20; // percent
        // state.taxRate = 0; // VAT exempt
      } else {
        state.discountType = null;
        state.discount = 0;
        // state.taxRate = 0.12;
      }
    },
  },
});

export const {
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
  setTaxRate,
  applyDiscount,
  setDiscountType,
} = cartSlice.actions;

export default cartSlice.reducer;
