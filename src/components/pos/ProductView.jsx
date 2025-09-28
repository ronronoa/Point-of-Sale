import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { PhilippinePeso } from "lucide-react";
import AddStockDialog from "./products/AddStockDialog";
import { setProduct } from "../../store/productSlice";
import RemoveProduct from "./products/RemoveProduct";
import axios from "axios";
import AddProductDialog from "./products/AddProductDialog";
export default function ProductView() {
  const products = useSelector((state) => state.products.products);
  const [selectedCategory] = useState();
  const [searchTerm] = useState("");
  const dispatch = useDispatch();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products")
        dispatch(setProduct(res.data))
      } catch (error) {
        console.error("Error fetching products", error)
      }
    }
    fetchProducts()
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-md p-2 md:p-4 border">
        <h2 className="text-lg md:text-3xl font-bold"> Products </h2>
        <div className="flex items-center justify-center gap-2">
          <AddProductDialog />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="flex items-center justify-center border-b border-gray-500">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-52 h-52 aspect-square object-cover"
                />
              </div>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm leading-tight">
                      {product.name}
                    </h3>
                    <div className="px-2 py-1 border rounded-full text-xs text-white bg-[#002f09]">
                      {product.category}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PhilippinePeso size={18} />
                    <p className="text-lg font-bold">
                      {product.price}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div
                      className={`px-2 py-1 border rounded-full
                  ${
                    product.stock > 10
                      ? "bg-[#007517] text-white"
                      : "bg-red-700 text-white"
                  }`}
                    >
                      <p className="text-xs">Stock: {product.stock}</p>
                    </div>

                    <div className="flex gap-2">
                      <AddStockDialog productId={product.id} />
                      {/* <button 
                className="px-2 py-1 border rounded text-xs bg-red-900 text-white"
                onClick={() => dispatch(removeProduct(product.id))}
                >
                  - Remove
                </button> */}
                <RemoveProduct productId={product.id} productName={product.name}/>               
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <h2 className="text-gray-600 text-center">No Product</h2>
      )}
    </div>
  );
}
