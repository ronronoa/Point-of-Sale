import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectDiscount = (state) => state.cart.discount;
export const selectDiscountType = (state) => state.cart.discountType;
export const selectTaxRate = (state) => state.cart.taxRate;

// Subtotal (before tax and discount)
export const selectSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.subtotal, 0)
);

// Total quantity
export const selectTotalItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.qty, 0)
);

// Compute discount amount based on type
export const selectDiscountAmount = createSelector(
  [selectSubtotal, selectDiscountType],
  (subtotal, discountType) => {
    if (discountType === "PWD" || discountType === "SENIOR") {
      return subtotal * 0.2; // 20% discount
    }
    return 0; // No discount
  }
);

// Compute tax amount
export const selectTaxAmount = createSelector(
  [selectSubtotal, selectDiscountAmount, selectDiscountType, selectTaxRate],
  (subtotal, discountAmount, discountType, taxRate) => {
    // PWD/SENIOR = VAT-exempt, so tax = 0
    if (discountType === "PWD" || discountType === "SENIOR") {
      return 0;
    }

    const taxableAmount = subtotal - discountAmount;
    return taxableAmount * taxRate;
  }
);

// Compute grand total
export const selectGrandTotal = createSelector(
  [selectSubtotal, selectDiscountAmount, selectTaxAmount],
  (subtotal, discountAmount, taxAmount) => {
    return subtotal - discountAmount + taxAmount;
  }
);

