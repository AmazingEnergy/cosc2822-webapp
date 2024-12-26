import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole !== "admin") {
        navigate("/");
      } else {
        fetchOrders();
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("idToken");
    await axios
      .get("https://service.dev.grp6asm3.com/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const apiOrders = response.data.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          contactName: order.contactName,
          contactEmail: order.contactEmail,
          deliveryAddress: order.deliveryAddress,
          status: order.status,
          totalAmount: order.totalAmount,
        }));
        setOrders(apiOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-[100vh]">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Orders</h2>
        </div>

        {/* Search Bar */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by Order Number ..."
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
                <th className="px-4 py-2">Order Number</th>
                <th className="px-4 py-2">Contact Name</th>
                <th className="px-4 py-2">Contact Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total Amount ($)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">{order.orderNumber}</td>
                  <td className="px-4 py-2">{order.contactName}</td>
                  <td className="px-4 py-2">{order.contactEmail}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2">{order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      View
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

export default Orders;
