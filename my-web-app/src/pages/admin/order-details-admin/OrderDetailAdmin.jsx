import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole !== "admin") {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem("idToken");
      try {
        const response = await axios.get(
          `https://service.dev.grp6asm3.com/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
        setSelectedStatus(response.data.status);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem("idToken");
    try {
      if (selectedStatus === "new") {
        alert("You cannot update the status to 'New'.");
        return;
      }

      // Define API endpoint based on status
      let endpoint = `https://service.dev.grp6asm3.com/orders/${order.id}`;
      if (selectedStatus === "completed") {
        endpoint = `${endpoint}/complete`;
      } else if (selectedStatus === "rejected") {
        endpoint = `${endpoint}/reject`; 
      }

      // Send the PUT request
      const response = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: response.data.status,
      }));

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="flex min-h-[100vh]">
      {/* Sidebar */}
      <AdminSideBar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="border rounded-lg bg-white">
          <p>
            <strong>Order Number:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Contact Name:</strong> {order.contactName}
          </p>
          <p>
            <strong>Contact Email:</strong> {order.contactEmail}
          </p>
          <p>
            <strong>Contact Phone:</strong> {order.contactPhone || "N/A"}
          </p>
          <p>
            <strong>Delivery Address:</strong> {order.deliveryAddress}
          </p>
          <p>
            <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
          </p>

          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {order.updatedAt
              ? new Date(order.updatedAt).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Created By:</strong> {order.createdBy}
          </p>

          {/* Status Dropdown */}
          <div className="mb-4 mt-2">
            <label className="block mb-2 font-semibold">Order Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="new">New</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option> {/* New status */}
            </select>
          </div>

          {/* Update Button */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleStatusUpdate}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
