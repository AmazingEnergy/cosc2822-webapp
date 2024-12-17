import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminSideBar from "../../../components/AdminSideBar";

const UpdateProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState({
    name: "",
    description: "",
    skuId: "",
    parentSkuId: "",
    category: "",
    type: "",
    price: "",
    imageUrls: [],
    stockCode: "",
    isActive: true,
    specs: { key: "", value: "" },
  });

  useEffect(() => {
    // Simulate fetching product data by ID
    const fetchProductById = async (productId) => {
      // Mock data for demonstration
      return {
        name: "Sample Product",
        description: "This is a sample product.",
        skuId: "SAMPLE123",
        parentSkuId: "PARENT123",
        category: "Electronics",
        type: "Device",
        price: 199.99,
        imageUrls: [
          "https://via.placeholder.com/150",
          "https://via.placeholder.com/150",
        ],
        stockCode: "STOCK123",
        isActive: true,
        specs: { key: "Color", value: "Black" },
      };
    };

    fetchProductById(id).then((data) => setProduct(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageUrls: [...prevProduct.imageUrls, ...newUrls],
    }));
  };

  const handleSpecChange = (e, specKey) => {
    setProduct({
      ...product,
      specs: { ...product.specs, [specKey]: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Updated:", product);
    alert("Product updated successfully!");
  };

  return (
    <div className="flex h-full">
      <AdminSideBar />

      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-screen-xl">
          <h1 className="text-2xl font-bold mb-6 text-black">Update Product</h1>
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

            {/* Image URLs */}
            <div className="mb-4">
              <label
                htmlFor="imageUrls"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Upload Images
              </label>
              <input
                type="file"
                id="imageUrls"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Image Preview */}
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {product.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
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

            {/* Specs */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Specifications
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={product.specs.key}
                  onChange={(e) => handleSpecChange(e, "key")}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={product.specs.value}
                  onChange={(e) => handleSpecChange(e, "value")}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;
