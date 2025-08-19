import { createSlice } from "@reduxjs/toolkit";
import { mockProducts } from '../data/mockData'

const initialState = {
    products: mockProducts,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateStock: (state, action) => {
            const { productId, quantity } = action.payload
            const product = state.products.find(p => p.id === productId)
            if(product && product.stock >= quantity) {
                product.stock -= quantity
            }
        },

        restockProduct: (state, action) => {
            const { productId, quantity } = action.payload
            const product = state.products.find(p => p.id === productId)
            if(product){
                product.stock += quantity
            }
        }
    }
})

export const { updateStock, restockProduct } = productSlice.actions
export default productSlice.reducer;