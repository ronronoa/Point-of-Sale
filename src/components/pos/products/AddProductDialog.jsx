import React, { useState } from "react";
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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";

const MySwal = withReactContent(Swal);

export default function AddProductDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    stock: "",
    date_added: today,
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
      !formData.stock ||
      !formData.date_added
    ) {
      MySwal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#032f30",
        timer: 1800,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }

    const productNameRegex = /^[A-Za-z -]+$/;
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
      data.append("date_added", formData.date_added);
      for (const key in formData) {
        if (key !== "customCategory") data.append(key, formData[key]);
      }

      if (formData.category === "other" && formData.customCategory) {
        data.set("category", formData.customCategory);
      }

      if (image) data.append("image", image);

      const res = await axios.post("http://localhost:5000/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success SweetAlert
      await MySwal.fire({
        icon: "success",
        title: "Product Added!",
        text: res.data.message,
        confirmButtonColor: "#032f30",
        timer: 1800,
        showConfirmButton: false,
        showCloseButton: true,
      });

      dispatch(addProduct(res.data.product));

      // Reset form
      setFormData({
        name: "",
        barcode: "",
        category: "",
        price: "",
        stock: "",
        date_added: today,
        image: "/placeholder.svg",
      });
      setImage(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      // MySwal.fire({
      //   icon: "error",
      //   title: "Error Adding Product",
      //   text: "Something went wrong while saving your product.",
      //   showConfirmButton: true,
      //   showCloseButton: true,
      //   timer: 1800,
      //   confirmButtonColor: "#032f30",
      // });
      toast.error(error.response?.data?.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "date_added") {
      const valueDate = value;
      const selectedDate = new Date(valueDate);
      const minDate = new Date("2020-01-01");
      const maxDate = new Date(today);

      if (selectedDate < minDate || selectedDate > maxDate) {
        setError("Date must be between 2020 and 2025.");
        setFormData((prev) => ({ ...prev, date_added: "" }));
      } else {
        setError("");
        setFormData((prev) => ({ ...prev, date_added: valueDate }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#032f30]"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#032f30]"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#032f30]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                      customCategory:
                        value === "other" ? prev.customCategory : "",
                    }))
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
                    {/* <SelectItem value="other">Other</SelectItem> */}
                  </SelectContent>
                </Select>

                {/* {formData.category === "other" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {" "}
                      Specify Category{" "}
                    </Label>
                    <input
                      type="text"
                      value={formData.customCategory || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customCategory: e.target.value,
                        }))
                      }
                      placeholder="Enter custom category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#032f30]"
                    />
                  </div>
                )} */}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {" "}
                  Date{" "}
                </Label>
                <input
                  type="date"
                  min="2020-01-01"
                  max={today}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#032f30]"
                  value={formData.date_added}
                  onChange={(e) =>
                    handleInputChange("date_added", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Product Image
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#032f30] file:text-white hover:file:bg-[#032122] transition"
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

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#032f30] hover:bg-[#032122] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#032f30]"
            >
              Add Product
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
