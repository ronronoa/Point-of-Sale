import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen } from "lucide-react";
import Barcode from "react-barcode";
import { mockCategories } from "../../../data/mockData";

export default function EditProduct({ product, onUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        barcode: product.barcode || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) {
      toast.error("No product selected for editing.");
      return;
    }

    try {
      setLoading(true);
      const updateData = new FormData();
      for (const key in formData) {
       if(key !== "customCategory") updateData.append(key, formData[key]);
      }

      if (formData.category === "other" && formData.customCategory) {
        updateData.set("category", formData.customCategory)
      }

      if (image) updateData.append("image", image);

      const response = await axios.put(
        `http://localhost:5000/products/update/${product.id}`,
        updateData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Product updated successfully!");
      onUpdated && onUpdated(response.data.updatedProduct);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to update product."
      );
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-1 md:px-2 py-0.5 md:py-1 border rounded text-[10px] md:text-xs bg-green-700 hover:bg-green-800 text-white hover:text-white cursor-pointer"
        >
          <SquarePen size={18} />
          Edit Product
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product: <span className="text-green-500">{product.name}</span></DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          {!product ? (
            <p className="text-sm text-gray-500">
              No product selected. Please choose one to edit.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Barcode</Label>
                    <Input
                      name="barcode"
                      type="text"
                      value={formData.barcode}
                      onChange={handleChange}
                      className="text-xs"
                    />

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
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    {/* <Input
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      className="text-xs"
                    /> */}

                    <Select
                    value={formData.category}
                    onValueChange={(value) => 
                        setFormData((prev) => ({ ...prev, category: value}))
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
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.category === "other" && (
                        <div className="space-y-2">
                            <Label> Specify Category </Label>
                            <Input
                            type="text"
                            value={formData.customCategory || ""}
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                customCategory: e.target.value,
                            }))
                        }
                        placeholder="Enter custom category"
                        className="text-xs mt-1"
                            />
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#032f30] file:text-white hover:file:bg-[#032122] transition"
                    />

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

              <div className="flex justify-end pt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
