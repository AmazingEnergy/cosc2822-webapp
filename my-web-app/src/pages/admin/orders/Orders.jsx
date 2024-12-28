import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
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
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Order Number ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Contact Name</TableCell>
                <TableCell>Contact Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount ($)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.contactName}</TableCell>
                  <TableCell>{order.contactEmail}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Orders;
