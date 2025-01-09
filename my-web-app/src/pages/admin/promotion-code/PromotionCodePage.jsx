import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const PromotionCodePage = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(
        "https://service.sandbox.grp6asm3.com/promotion/codes"
      );
      const apiPromotions = response.data.items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        availableFrom: new Date(item.availableFrom).toLocaleDateString(),
        availableTo: new Date(item.availableTo).toLocaleDateString(),
        discount: (item.discount * 100).toFixed(2) + "%",
      }));
      setPromotions(apiPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole === "admin") {
        fetchPromotions();
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleCreatePromotion = () => {
    navigate("/admin/create-promotion-code");
  };

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" gutterBottom>
            Promotions
          </Typography>
          <Button variant="contained" onClick={handleCreatePromotion}>
            + Create Promotion
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by promotion name ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Available From</TableCell>
                <TableCell>Available To</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.code}</TableCell>
                  <TableCell>{promotion.quantity}</TableCell>
                  <TableCell>{promotion.availableFrom}</TableCell>
                  <TableCell>{promotion.availableTo}</TableCell>
                  <TableCell>{promotion.discount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/promotion-codes/${promotion.code}`)
                      }
                    >
                      Edit
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

export default PromotionCodePage;
