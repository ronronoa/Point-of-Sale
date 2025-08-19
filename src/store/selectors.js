import { createSelector } from "@reduxjs/toolkit";

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectDiscount = (state) => state.cart.discount;
export const selectTaxRate = (state) => state.cart.taxRate;

export const selectSubtotal = createSelector(
    [selectCartItems],
    (items) => items.reduce((sum, item) => sum + item.subtotal, 0)
)

export const selectTotalItems = createSelector(
    [selectCartItems],
    (items) => items.reduce((sum, item) => sum + item.qty, 0)
)

export const selectDiscountAmount = createSelector(
    [selectSubtotal, selectDiscount],
    (subtotal, discount) => {
        if(typeof discount === 'number') {
            return discount
        }

        if(discount && typeof discount === 'object') {
            if(discount.type === 'percent') {
                return(subtotal * discount.value) / 100
            }

            if(discount.type === 'fixed') {
                return discount.value
            }
        }
        return 0;
    }
)

export const selectTaxAmount = createSelector(
    [selectSubtotal,selectDiscountAmount, selectTaxRate],
    (subtotal, discountAmount, taxRate) => {
        const taxableAmount = subtotal - discountAmount;
        return taxableAmount * taxRate
    }
)

export const selectGrandTotal = createSelector(
  [selectSubtotal, selectDiscountAmount, selectTaxAmount],
  (subtotal, discountAmount, taxAmount) => {
    return subtotal - discountAmount + taxAmount;
  }
);
