import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    skuId: "",
    parentSkuId: "",
    category: "",
    type: "",
    price: "",
    imageFiles: [],
    stockCode: "",
    isActive: true,
    layer1: { name: "", value: "" },
    layer2: { name: "", value: "" },
  });
   const { isAuthenticated, userRole } = useAuth();
   const navigate = useNavigate();

   useEffect( () => {
      if (isAuthenticated && userRole !== undefined) {
        if (userRole !== "admin") {
          navigate("/");
        }
      }
    }, [isAuthenticated, userRole, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleLayerChange = (layer, field, value) => {
    setProduct({
      ...product,
      [layer]: { ...product[layer], [field]: value },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageFiles: [...prevProduct.imageFiles, ...files],
    }));
  };

  const removeImage = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageFiles: prevProduct.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToCloudinary = async () => {
    try {
      const uploadedUrls = await Promise.all(
        product.imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "rvk0lbpb");
          formData.append("cloud_name", "duond2je0");

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/duond2je0/image/upload`,
            formData
          );

          return response.data.secure_url;
        })
      );

      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images to Cloudinary:", error);
      throw new Error("Failed to upload images. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("idToken");

    try {
      const imageUrls = await uploadImagesToCloudinary();

      const formattedProduct = {
        skuId: product.skuId,
        name: product.name,
        description: product.description,
        category: product.category,
        type: product.type,
        imageUrls,
        price: product.price,
        stockCode: product.stockCode,
        parentSkuId: product.parentSkuId,
        specs: {
          layer1Name: product.layer1.name,
          layer1Value: product.layer1.value,
          layer2Name: product.layer2.name,
          layer2Value: product.layer2.value,
        },
        isActive: product.isActive,
      };

      const response = await axios.post(
        "https://service.dev.grp6asm3.com/products",
        formattedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Product created successfully!");
        navigate("/admin/products");
      } else {
        alert("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.message || "An error occurred while creating the product.");
    }
  };

  return (
    <div className="flex min-h-[100vh]">
      <AdminSideBar />
      <div className="flex-1 p-6 bg-gray-100 h-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6 text-black">
            Create New Product
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full min-h-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              ></textarea>
            </div>

            {/* SKU ID */}
            <div className="mb-4">
              <label
                htmlFor="skuId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                SKU ID
              </label>
              <input
                type="text"
                id="skuId"
                name="skuId"
                value={product.skuId}
                onChange={handleChange}
                placeholder="Enter SKU ID"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Parent SKU ID */}
            <div className="mb-4">
              <label
                htmlFor="parentSkuId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Parent SKU ID
              </label>
              <input
                type="text"
                id="parentSkuId"
                name="parentSkuId"
                value={product.parentSkuId}
                onChange={handleChange}
                placeholder="Enter Parent SKU ID"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Type */}
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={product.type}
                onChange={handleChange}
                placeholder="Enter type"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label
                htmlFor="imageFiles"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Upload Images
              </label>
              <input
                type="file"
                id="imageFiles"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Image Preview */}
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {product.imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Code */}
            <div className="mb-4">
              <label
                htmlFor="stockCode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Stock Code
              </label>
              <input
                type="text"
                id="stockCode"
                name="stockCode"
                value={product.stockCode}
                onChange={handleChange}
                placeholder="Enter stock code"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            {/* Is Active */}
            <div className="mb-4">
              <label
                htmlFor="isActive"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Active
              </label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={product.isActive}
                onChange={(e) =>
                  setProduct({ ...product, isActive: e.target.checked })
                }
                className="h-5 w-5"
              />
            </div>

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Specifications
            </label>
            {/* Layer 1 */}
            <div className="mb-4">
              <label
                htmlFor="layer1Name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Layer 1 Name
              </label>
              <input
                type="text"
                id="layer1Name"
                value={product.layer1.name}
                onChange={(e) =>
                  handleLayerChange("layer1", "name", e.target.value)
                }
                placeholder="Enter Layer 1 Name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
              <label
                htmlFor="layer1Value"
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
              >
                Layer 1 Value
              </label>
              <input
                type="text"
                id="layer1Value"
                value={product.layer1.value}
                onChange={(e) =>
                  handleLayerChange("layer1", "value", e.target.value)
                }
                placeholder="Enter Layer 1 Value"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Layer 2 */}
            <div className="mb-4">
              <label
                htmlFor="layer2Name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Layer 2 Name
              </label>
              <input
                type="text"
                id="layer2Name"
                value={product.layer2.name}
                onChange={(e) =>
                  handleLayerChange("layer2", "name", e.target.value)
                }
                placeholder="Enter Layer 2 Name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
              <label
                htmlFor="layer2Value"
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
              >
                Layer 2 Value
              </label>
              <input
                type="text"
                id="layer2Value"
                value={product.layer2.value}
                onChange={(e) =>
                  handleLayerChange("layer2", "value", e.target.value)
                }
                placeholder="Enter Layer 2 Value"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
