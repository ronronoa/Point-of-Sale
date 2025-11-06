import { createSelector } from "@reduxjs/toolkit";

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectDiscount = (state) => state.cart.discount;
export const selectDiscountType = (state) => state.cart.discountType;
export const selectTaxRate = (state) => state.cart.taxRate;

export const selectDisplaySubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.subtotal, 0)
);

export const selectBaseSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => {
    const basePrice = item.basePrice || (item.price / (1 + item.taxRate));
    return sum + (basePrice * item.qty);
  }, 0)
);

export const selectSubtotal = createSelector(
  [selectDisplaySubtotal, selectBaseSubtotal, selectDiscountType],
  (displaySubtotal, baseSubtotal, discountType) => {
    if (discountType === "PWD" || discountType === "SENIOR") {
      return baseSubtotal;
    }
    return displaySubtotal;
  }
);

export const selectTotalItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.qty, 0)
);

export const selectDiscountAmount = createSelector(
  [selectSubtotal, selectDiscountType],
  (subtotal, discountType) => {
    if (discountType === "PWD" || discountType === "SENIOR") {
      return subtotal * 0.2;
    }
    return 0;
  }
);

export const selectTaxAmount = createSelector(
  [selectBaseSubtotal, selectDiscountAmount, selectDiscountType, selectTaxRate],
  (baseSubtotal, discountAmount, discountType, taxRate) => {
    if (discountType === "PWD" || discountType === "SENIOR") {
      return 0;
    }

    const taxableAmount = baseSubtotal - discountAmount;
    return taxableAmount * taxRate;
  }
);

export const selectGrandTotal = createSelector(
  [selectSubtotal, selectDiscountAmount, selectTaxAmount],
  (subtotal, discountAmount) => {
    const total = subtotal - discountAmount;
    return Math.round(total * 100) / 100;
  }
);