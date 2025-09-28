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

export default function AddProductDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("barcode", formData.barcode)
      data.append("category", formData.category)
      data.append("price", formData.price)
      data.append("stock", formData.stock)

      if(image) {
        data.append("image", image)
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
    });
    setImage(null);
    setOpen(false);

    } catch (error) {
      console.error(error);
    toast.error("Error adding product");
    }

    // dispatch(
    //   addProduct({
    //     ...formData,
    //     price: parseFloat(formData.price),
    //     stock: parseInt(formData.stock),
    //     image: (formData.image)
    //   })
    // );

    // toast.success("Product added successfully");
    // setFormData({
    //   name: "",
    //   barcode: "",
    //   category: "",
    //   price: "",
    //   stock: "",
    //   image: "/placeholder.svg",
    // });
    // setOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-center" />
      <DialogTrigger asChild>
        <button className="px-4 py-2 border rounded bg-[#032f30] hover:bg-[#032122] text-white cursor-pointer">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Add New Product </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              className="px-4 py-1 w-full rounded border transition duration-200 
                                focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => handleInputChange("barcode", e.target.value)}
              placeholder="Enter barcode"
              className="px-4 py-1 w-full rounded border transition duration-200 
                                focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label> Price </Label>
            <input
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Enter price"
              className="px-4 py-1 w-full rounded border transition duration-200 
                                focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
            />
          </div>

          <div className="space-y-2">
            <Label> Quantity </Label>
            <input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              placeholder="Enter quantity"
              className="px-4 py-1 w-full rounded border transition duration-200 
                                focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
            />
          </div>

          <div className="space-y-2">
            <Label> Product Image </Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              placeholder=""
              className="px-4 py-1 w-full rounded border transition duration-200"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg border mt-2"/>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 border rounded bg-[#032f30] hover:bg-[#032122] text-white w-full"
            onClick={() => toast.remove()}
          >
            Add Product
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
