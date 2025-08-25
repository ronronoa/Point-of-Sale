import { createSlice } from "@reduxjs/toolkit";
import { mockProducts } from '@/data/mockData'

const savedProducts = JSON.parse(localStorage.getItem("products"))
const initialState = {
    products: savedProducts || mockProducts,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateStock: (state, action) => {
            const { productId, quantity } = action.payload
            const product = state.products.find(p => p.id === productId)
            console.log("Updating stock for: ", productId, product)
            if(product) {
                product.stock = Math.max(product.stock - quantity, 0)
                localStorage.setItem("products",JSON.stringify(state.products))
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