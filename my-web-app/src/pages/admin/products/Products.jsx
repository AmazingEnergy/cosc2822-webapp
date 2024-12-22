import React, { useEffect, useState } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProduct = async () => {
    await axios
      .get("https://service.dev.grp6asm3.com/products")
      .then((response) => {
        const apiProducts = response.data.items.map((item, index) => ({
          id: index + 1,
          name: item.name,
          category: item.category,
          type: item.type,
          price: item.price,
          skuId: item.skuId,
        }));
        setProducts(apiProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    
  }
  

  useEffect(() => {
    fetchProduct();
  }, []);


  const handleCreateProduct = () => {
    navigate("/admin/create-product");
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            className="px-4 py-2 bg-[#D07373] text-white rounded border-[#D07373] border-solid hover:bg-[#E89F71]"
            onClick={handleCreateProduct}
          >
            + Create Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/products/${product.skuId}`)}
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
