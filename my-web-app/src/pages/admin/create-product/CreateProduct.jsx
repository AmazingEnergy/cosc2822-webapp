import React, { useState } from "react";
import AdminSideBar from "../../../components/AdminSideBar";

const CreateProduct = () => {
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
     specs: [{ key: "", value: "" }], // Specs as an array of objects
   });

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

   const handleSpecChange = (index, field, value) => {
     const updatedSpecs = [...product.specs];
     updatedSpecs[index][field] = value;
     setProduct({ ...product, specs: updatedSpecs });
   };

   const addSpec = () => {
     setProduct({
       ...product,
       specs: [...product.specs, { key: "", value: "" }],
     });
   };

   const removeSpec = (index) => {
     const updatedSpecs = product.specs.filter((_, i) => i !== index);
     setProduct({ ...product, specs: updatedSpecs });
   };

   const handleSubmit = (e) => {
     e.preventDefault();
     console.log("Product Created:", product);
     alert("Product saved successfully!");
     setProduct({
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
       specs: [{ key: "", value: "" }],
     }); // Reset form
   };


  return (
    <div className="flex h-auto ">
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

            {/* Specifications */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Specifications
              </label>
              {product.specs.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpec}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
              >
                Add Specification
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pb-4">
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
