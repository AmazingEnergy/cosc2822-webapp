import React from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      name: "Satchel Hand Bag",
      category: "Hand bag",
      type: "Accessory",
      price: 49.99,
    },
    {
      id: 2,
      name: "Beach Shirt Blouses",
      category: "Top",
      type: "Clothing",
      price: 26.99,
    },
    {
      id: 3,
      name: "Bowknot Hat",
      category: "Hat",
      type: "Accessory",
      price: 25.99,
    },
    {
      id: 4,
      name: "Long Dress",
      category: "Dress",
      type: "Clothing",
      price: 37.99,
    },
  ];

  const handleCreateProduct = () => {
    navigate("/admin/create-product");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            className="px-4 py-2 bg-[#D07373] text-white rounded border-[#D07373] border-solid hover:bg-[#E89F71]  "
            onClick={() => handleCreateProduct()}
          >
            + Create Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Table */}
        <div className="overflow-auto border rounded-lg">
          <table className="w-full border-collapse bg-white text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Price ($)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                    >
                      {product.name}
                    </button>
                  </td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.type}</td>
                  <td className="px-4 py-2">{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
