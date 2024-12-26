import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../../components/AdminSideBar";
import useAuth from "../../../hooks/useAuth";

const UpdateInventoryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState({
    quantity: 0,
    isActive: true,
    stockCode: "",
  });
  const token = localStorage.getItem("idToken");

  const { isAuthenticated, userRole } = useAuth();

    useEffect(() => {
      if (isAuthenticated && userRole !== undefined) {
        if (userRole !== "admin") {
          navigate("/");
        }
      }
    }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          `https://service.dev.grp6asm3.com/inventories/${code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, [code]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventory((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://service.dev.grp6asm3.com/inventories/${code}`,
        { quantity: inventory.quantity }, // Only send the quantity field
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Inventory updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory.");
    }
  };

  return (
    <div className="flex min-h-[100vh]">
      <AdminSideBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Update Inventory</h1>
        {inventory ? ( // Check if inventory data is available
          <>
            <div className="mt-4">
              <label className="block mb-2">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={inventory.quantity}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Active Status:</label>
              <select
                name="isActive"
                value={inventory.isActive}
                disabled // Make this field read-only
                className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Stock Code:</label>
              <input
                type="text"
                name="stockCode"
                value={inventory.stockCode}
                disabled // Make this field read-only
                className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Update Inventory
            </button>
          </>
        ) : (
          <p>Loading inventory details...</p> // Fallback message while data is being fetched
        )}
      </div>
    </div>
  );
};

export default UpdateInventoryPage;
