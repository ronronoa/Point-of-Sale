import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockProducts } from "@/data/mockData";
import { loadState, saveState } from "../utils/localStorage";
import axios from "axios";

export const restockProductAsync = createAsyncThunk(
    "products/restockProductAsync",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/products/${id}/stock`,
                {quantity}
            )
            return { id, quantity, message: res.data.message}
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error updating stock"})
        }
    }
)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/products")
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch products" });
    }
  }
)
const initialState = {
  products: loadState("products") || [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      console.log("Updating stock for: ", productId, product);
        saveState("products", state.products)
      if (product && product.stock >= quantity) {
        product.stock -= quantity;
      }
    },

    restockProduct: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.stock += quantity;
        saveState("products", state.products);
      }
    },

    updateProduct: (state, action) => {
      const { productId, updatedData } = action.payload;
      const existingProduct = state.products.find(product => product.id === productId);
      if (existingProduct) {
        Object.assign(existingProduct, updatedData);
      }
    },

    addProduct: (state, action) => {
      const newProduct = action.payload
      state.products.push(newProduct);
      saveState("products", state.products);
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      saveState("products", state.products);
      // localStorage.setItem("products", JSON.stringify(state.products))
    },

    setProduct: (state, action) => {
        state.products = action.payload
    },

    updateProductStock: (state, action) => {
      const { id, newStock } = action.payload
      const product = state.products.find((p) => p.id === id)
      if(product) {
        product.stock = newStock
      }
    }
  },
  extraReducers: (builder) => {
  builder
    .addCase(restockProductAsync.fulfilled, (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.stock += quantity;
        saveState("products", state.products);
      }
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      saveState("products", state.products);
    });
}
});

export const { updateStock, restockProduct, addProduct, removeProduct, setProduct, updateProductStock, updateProduct } =
  productSlice.actions;
export default productSlice.reducer;
