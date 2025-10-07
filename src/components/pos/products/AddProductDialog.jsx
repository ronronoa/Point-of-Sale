import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../store/productSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCategories } from "../../../data/mockData";
import axios from "axios";
import Barcode from "react-barcode";

export default function AddProductDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    stock: "",
    image: "/placeholder.svg",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.barcode ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const productNameRegex = /^[A-Za-z ]+$/;

    if (!productNameRegex.test(formData.name)) {
      setError("Product name must contain letters only");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("barcode", formData.barcode);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      if (image) {
        data.append("image", image);
      }

      const res = await axios.post("http://localhost:5000/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      dispatch(addProduct(res.data.product));

      setFormData({
        name: "",
        barcode: "",
        category: "",
        price: "",
        stock: "",
        image: "/placeholder.svg",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-center" />
      <DialogTrigger asChild>
        <button className="px-4 py-2 border rounded bg-[#032f30] hover:bg-[#032122] text-white cursor-pointer transition-colors duration-200">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Product Name *
                </Label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#032f30] focus:border-transparent transition duration-200"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              {/* Barcode */}
              <div className="space-y-2">
                <Label
                  htmlFor="barcode"
                  className="text-sm font-medium text-gray-700"
                >
                  Barcode *
                </Label>
                <input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  placeholder="Enter barcode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#032f30] focus:border-transparent transition duration-200"
                />
              </div>

              {/* Barcode Preview */}
              {formData.barcode && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Barcode Preview
                  </Label>
                  <div className="flex justify-center p-3 bg-white border border-gray-300 rounded-md">
                    <Barcode
                      value={formData.barcode}
                      width={1.5}
                      height={60}
                      displayValue={true}
                      background="#fff"
                    />
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category *
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger className="w-full border border-gray-300 focus:ring-2 focus:ring-[#032f30]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700"
                  >
                    Price *
                  </Label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#032f30] focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Quantity *
                  </Label>
                  <input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#032f30] focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Product Image
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#032f30] file:text-white hover:file:bg-[#032122] transition duration-200"
                />

                {/* Image Preview */}
                <div className="mt-2 border border-gray-300 rounded-md p-2 bg-gray-50">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Product Preview"
                      className="w-full h-48 object-contain rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                      <img
                        src={formData.image}
                        alt="Placeholder"
                        className="w-16 h-16 opacity-50 mb-2"
                      />
                      <p className="text-sm">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#032f30] hover:bg-[#032122] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#032f30]"
              onClick={() => toast.remove()}
            >
              Add Product
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
