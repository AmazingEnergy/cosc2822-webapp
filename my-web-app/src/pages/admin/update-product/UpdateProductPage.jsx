import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const UpdateProductPage = () => {
    const { skuId } = useParams(); 
  const [product, setProduct] = useState({
    name: "",
    description: "",
    skuId: "",
    parentSkuId: "",
    category: "",
    type: "",
    price: "",
    existingImageUrls: [],
    newImageFiles: [],
    stockCode: "",
    isActive: true,
    layer1: { name: "", value: "" },
    layer2: { name: "", value: "" },
  });
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole !== "admin") {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("idToken");
        const response = await axios.get(
          `https://service.dev.grp6asm3.com/products/${skuId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedProduct = response.data;
        setProduct({
          ...product,
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          skuId: fetchedProduct.skuId,
          parentSkuId: fetchedProduct.parentSkuId,
          category: fetchedProduct.category,
          type: fetchedProduct.type,
          price: fetchedProduct.price,
          existingImageUrls: fetchedProduct.imageUrls,
          stockCode: fetchedProduct.stockCode,
          isActive: fetchedProduct.isActive,
          layer1: {
            name: fetchedProduct.specs.layer1Name,
            value: fetchedProduct.specs.layer1Value,
          },
          layer2: {
            name: fetchedProduct.specs.layer2Name,
            value: fetchedProduct.specs.layer2Value,
          },
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [skuId]);

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
      newImageFiles: [...prevProduct.newImageFiles, ...files],
    }));
  };

  const removeExistingImage = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      existingImageUrls: prevProduct.existingImageUrls.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const removeNewImage = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      newImageFiles: prevProduct.newImageFiles.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToCloudinary = async () => {
    try {
      const uploadedUrls = await Promise.all(
        product.newImageFiles.map(async (file) => {
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
      const newImageUrls = await uploadImagesToCloudinary();

      const updatedProduct = {
        skuId: product.skuId,
        name: product.name,
        description: product.description,
        category: product.category,
        type: product.type,
        imageUrls: [...product.existingImageUrls, ...newImageUrls],
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

      const response = await axios.put(
        `https://service.dev.grp6asm3.com/products/${skuId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate(`/admin/products/${skuId}`);
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "An error occurred while updating the product.");
    }
  };

  return (
    <div className="flex min-h-[100vh]">
      <AdminSideBar />
      <div className="flex-1 p-6 bg-gray-100 h-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6 text-black">Update Product</h1>
          {product ? (
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

              {/* Existing Images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Existing Images
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.existingImageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Image Upload */}
              <div className="mb-4">
                <label
                  htmlFor="newImageFiles"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Upload New Images
                </label>
                <input
                  type="file"
                  id="newImageFiles"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {product.newImageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
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
                  Update Product
                </button>
              </div>
            </form>
          ) : (
            <p>Loading product details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;
