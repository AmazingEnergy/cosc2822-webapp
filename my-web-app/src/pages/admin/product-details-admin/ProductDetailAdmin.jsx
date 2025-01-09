import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../../components/AdminSideBar";
import useAuth from "../../../hooks/useAuth";

const ProductDetailAdmin = () => {
  const { skuId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole !== "admin") {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://service.sandbox.grp6asm3.com/products/${skuId}`
        );
        const item = response.data;

        setProduct({
          name: item.name,
          category: item.category,
          type: item.type,
          price: item.price,
          description: item.description,
          imageUrls: item.imageUrls || [],
          stockCode: item.stockCode,
          parentSkuId: item.parentSkuId,
          isActive: item.isActive,
          skuId: item.skuId,
          specs: item.specs || {},
          inventory: item.inventory || {},
        });

        setMainImage(item.imageUrls?.[0] || "");
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      }
    };

    fetchProductDetails();
  }, [skuId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleUpdate = () => {
    navigate(`/admin/products/update/${skuId}`);
  };

  const handleUpdateInventory = () => {
    navigate(`/admin/update-inventory/${product.stockCode}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Main Image and Thumbnails */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-64 h-64 rounded-lg shadow-md object-cover"
            />
            <div className="flex gap-2 flex-wrap">
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(url)}
                  className={`w-16 h-16 rounded-lg shadow-md cursor-pointer ${
                    mainImage === url ? "border-2 border-blue-500" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Details</h3>
              <p className="mt-2">
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium">Type:</span> {product.type}
              </p>
              <p>
                <span className="font-medium">Price:</span> $
                {product.price.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specs && (
              <div>
                <h3 className="text-lg font-semibold">Specifications</h3>
                <div className="mt-2">
                  {product.specs.layer1Name && (
                    <p>
                      <span className="font-medium">
                        {product.specs.layer1Name}:
                      </span>{" "}
                      {product.specs.layer1Value}
                    </p>
                  )}
                  {product.specs.layer2Name && (
                    <p>
                      <span className="font-medium">
                        {product.specs.layer2Name}:
                      </span>{" "}
                      {product.specs.layer2Value}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Inventory Info */}
          {product.inventory && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Inventory</h3>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {product.inventory.quantity}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {product.inventory.isActive ? "Active" : "Inactive"}
              </p>
              <p>
                <span className="font-medium">Stock Code:</span>{" "}
                {product.inventory.stockCode}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Product
            </button>
            <button
              onClick={handleUpdateInventory}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;
