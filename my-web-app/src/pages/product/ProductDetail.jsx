import React, { useState } from "react";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState("8GB-256GB");
  const [selectedColor, setSelectedColor] = useState("Cosmic Black");
  const [mainImage, setMainImage] = useState(
    "https://via.placeholder.com/400" 
  );

  const product = {
    skul: "SAMSUNG_GALACY_S23_ULTRA_COSMIC_BLACK_8GB_256GB",
    name: "Samsung Galaxy S23 Ultra 8GB 256GB",
    description:
      "The Samsung Galaxy S20 Ultra is the new flagship of the Galaxy S series, introduced by Samsung in early 2020. This is the most advanced version alongside the standard and Plus versions. The phone will feature incredible specifications, including a large battery, a 120Hz display refresh rate, and a 108MP primary camera. For a budget-friendly option with premium features, check out the Samsung S20 FE, currently at an attractive price.",
    category: "Mobile",
    type: "Device",
    imageUrls: [
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/500",
    ],
    price: 100,
    stockCode: "P00001002",
    parentSkul: "SAMSUNG_GALACY_S20_ULTRA",
    isActive: true,
    specs: {
      colors: ["Cosmic Black", "Gold", "Black", "Purple"],
      storages: ["8GB-256GB", "12GB-512GB", "12GB-1TB"],
    },
  };

  const handleAddToCart = () => {
    console.log(
      `Added ${quantity} of ${product.name} (${selectedColor}, ${selectedStorage}) to cart.`
    );
    alert(
      `Added ${quantity} of "${product.name}" (${selectedColor}, ${selectedStorage}) to cart!`
    );
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-white p-8 gap-6">
        {/* Product Images Section */}
        <div className="flex flex-col items-center gap-4">
          {/* Main Image */}
          <img
            src={mainImage} // Display selected main image
            alt="Main Product"
            className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover transform hover:scale-105 transition-transform duration-300"
          />

          {/* Thumbnails */}
          <div className="flex gap-4">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product Thumbnail ${index + 1}`}
                onClick={() => setMainImage(url)} // Update main image on click
                className={`w-16 h-16 rounded-lg shadow-md object-cover cursor-pointer transform transition-transform duration-300 ${
                  mainImage === url ? "border-2 border-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-start p-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <p className="text-2xl text-[#D07373] font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>

          {/* Specifications - Storage */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2">Select Storage:</h3>
            <div className="grid grid-cols-3 gap-2">
              {product.specs.storages.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`p-2 text-sm border rounded-lg text-center cursor-pointer ${
                    selectedStorage === storage
                      ? "border-red-500 text-red-600 font-bold"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications - Color */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2">Select Color:</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.specs.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`p-2 text-sm border rounded-lg text-center cursor-pointer ${
                    selectedColor === color
                      ? "border-red-500 text-red-600 font-bold"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-4">
            <label
              htmlFor="quantity"
              className="text-gray-700 font-semibold text-sm"
            >
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="px-2 py-1 text-sm border rounded-lg focus:ring focus:ring-blue-300"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="text-gray-600 text-sm leading-relaxed mb-4">
            <h3 className="text-base font-semibold mb-2">
              Product Description:
            </h3>
            <p>{product.description}</p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-[#D07373] text-white font-bold text-sm px-4 py-2 rounded-lg shadow-lg hover:bg-[#B55E5E] transition duration-300 focus:ring-4 focus:ring-blue-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
