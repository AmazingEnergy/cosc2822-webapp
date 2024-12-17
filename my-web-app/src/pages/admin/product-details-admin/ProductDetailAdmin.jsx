import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AdminSideBar from "../../../components/AdminSideBar";

const ProductDetailAdmin = () => {
  const { id } = useParams(); // Retrieve the 'id' from the URL
  const navigate = useNavigate(); // For navigation
  const [product, setProduct] = useState(null);

  // Mock fetchProductDetails function to simulate API call
  const fetchProductDetails = async (productId) => {
    // Simulate fetching product data based on `id`
    return {
      skuId: productId,
      name: "Samsung Galaxy S23 Ultra 8GB 256GB",
      category: "Mobile",
      type: "Device",
      price: 100,
      description:
        "Samsung Galaxy S20 Ultra is a flagship phone introduced by Samsung in early 2020. It offers great features, including a 108MP camera, a large battery, and a 120Hz display refresh rate.",
      imageUrls: {
        L: [
          "https://pictures.com/product1-01.png",
          "https://pictures.com/product1-02.png",
        ],
      },
      specs: {
        M: {
          Layer1Name: { S: "Color" },
          Layer1Value: { S: "Cosmic Black" },
          Layer2Name: { S: "Storage" },
          Layer2Value: { S: "8GB-256GB" },
        },
      },
      stockCode: "P00001002",
      parentSkuId: "SAMSUNG_GALACY_S20_ULTRA",
      isActive: true,
    };
  };

  useEffect(() => {
    // Fetch product details when component mounts
    fetchProductDetails(id).then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // Handle navigation to update page
  const handleUpdate = () => {
    navigate(`/admin/products/update/${id}`);
  };

  return (
    <div className="flex h-screen">
      {<AdminSideBar />}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2">Category: {product.category}</p>
        <p>Type: {product.type}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p className="mt-4">{product.description}</p>

        {/* Update Product Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            className="bg-[#D07373] text-white px-4 py-2 rounded hover:bg-[#E89F71]"
          >
            Update Product
          </button>
        </div>

        {/* Images Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Images</h2>
          <div className="flex gap-4 mt-2">
            {product.imageUrls.L.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} - Image ${index + 1}`}
                className="w-48 h-48 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <table className="mt-2 table-auto border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">
                  {product.specs.M.Layer1Name.S}
                </td>
                <td className="border px-4 py-2">
                  {product.specs.M.Layer1Value.S}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">
                  {product.specs.M.Layer2Name.S}
                </td>
                <td className="border px-4 py-2">
                  {product.specs.M.Layer2Value.S}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;



