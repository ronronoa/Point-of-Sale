import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  discount: 0,
  taxRate: 0.08,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const exisitingItem = state.items.find((item) => item.id === product.id);

      if (exisitingItem) {
        exisitingItem.qty += qty;
        exisitingItem.subtotal = exisitingItem.qty * exisitingItem.price;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          images: product.images,
          price: product.price,
          qty,
          subtotal: product.price * qty,
        });
      }
    },

    updateQty: (state, action) => {
      const { productId, qty } = action.payload;

      if (qty <= 0) {
        state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((item) => item.id === productId);

        if (item) {
          item.qty = qty;
          item.subtotal = item.price * qty;
        }
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },

    clearCart: (state) => {
        state.items = []
    },

    setTaxRate: (state, action) => {
      state.taxRate = action.payload;
    },

    applyDiscount: (state, action) => {
      state.discount = action.payload;
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
} = cartSlice.actions;
export default cartSlice.reducer;
