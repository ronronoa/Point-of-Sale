import { PhilippinePeso, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { mockCategories } from "../../data/mockData";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { addToCart } from "@/store/cartSlice";
import { AnimatePresence, motion } from "motion/react";
import Barcode from "react-barcode";
import { useTheme } from "../../contexts/ThemeProvider";
import { setProduct } from "../../store/productSlice";
import { selectTaxRate } from "../../store/selectors";
import axios from "axios";

export default function ProductGrid() {
  const [categories] = useState(mockCategories);
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const taxRate = useSelector(selectTaxRate);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.barcode.includes(term);
    return matchesCategory && matchesSearch;
  });

  const calculatePriceWithTax = (basePrice) => {
    return basePrice * (1 + taxRate);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        dispatch(setProduct(res.data));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  const handleAddtoCart = (product) => {
    if (product.stock <= 0) {
      toast.error(`${product.name} is Currently Out of Stock.`);
      return;
    }
    dispatch(addToCart({ product, qty: 1 }));
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              className="bg-[#FFFFFF] dark:bg-black px-6 py-4 w-72 rounded-lg border shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <img
                  src="/Product_Image/static-check.png"
                  alt=""
                  className="w-5 h-5 mb-2 mr-2"
                />
                <p className="text-black dark:text-white text-md mb-2">
                  Added to Cart.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{`${product.name} has been added to cart.`}</p>
            </motion.div>
          )}
        </AnimatePresence>
      ),
      // toast duration
      {
        duration: 1000,
      }
    );
  };
  return (
    <div className="space-y-6">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{ removeDelay: 100 }}
      />
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-700" />
          <input
            type="text"
            className="focus:outline-none focus:ring-2 focus:ring-gray-500 
                            rounded-lg py-2 pl-10 pr-5 text-sm transition duration-300 border-2 border-gray-300
                            dark:border-[#2e2e2e]"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 text-sm dark:text-gray-300 border rounded border-gray-300 transition-colors duration-200 cursor-pointer
                            ${
                              selectedCategory === ""
                                ? "text-white bg-[#2f2f2f]"
                                : ""
                            }`}
            onClick={() => setSelectedCategory("")}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-4 py-2 text-sm dark:text-gray-300 border rounded border-gray-300 
                                transition-colors duration-200 cursor-pointer
                                ${
                                  selectedCategory === category.name
                                    ? "text-white bg-[#2f2f2f]"
                                    : ""
                                }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const priceWithTax = calculatePriceWithTax(product.price);
            return (
              <Card
                key={product.id}
                className={`overflow-hidden hover:scale-105 transition duration-200 cursor-pointer ${
                  product.stock <= 0 ? "bg-black/30" : ""
                }`}
                onClick={() => handleAddtoCart(product, toast.remove())}
              >
                <div className="flex items-center justify-center border-b border-gray-500">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="w-52 h-52 aspect-square"
                  />
                </div>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`font-medium text-sm leading-tight ${
                          product.stock <= 0 ? "text-red-500" : ""
                        }`}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs py-1 px-2 border rounded-full bg-[#0F172A] text-white">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <PhilippinePeso size={18} />
                      <p className="text-lg font-bold">{priceWithTax.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div
                        className={`px-2 py-1 border rounded-full
                                    ${
                                      product.stock > 10
                                        ? "bg-[#0F172A] text-white white"
                                        : "bg-red-700 text-white"
                                    }`}
                      >
                        <p className="text-xs">Stock: {product.stock}</p>
                      </div>

                      <button
                        className="p-2 rounded border text-sm bg-[#E5E5E5] cursor-pointer disabled:opacity-50 disabled:text-gray-900 disabled:dark:text-gray-500 dark:text-black"
                        disabled={product.stock <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddtoCart(product, toast.remove());
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-red-500 font-semibold">
                      {product.stock <= 0 ? "Out of stock." : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <h2 className="text-gray-700 text-center">
          <p>No Products found.</p>
        </h2>
      )}
    </div>
  );
}
