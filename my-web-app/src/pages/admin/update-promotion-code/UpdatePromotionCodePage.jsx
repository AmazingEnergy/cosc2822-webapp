import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Paper, Grid } from "@mui/material";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const UpdatePromotionCodePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
    const token = localStorage.getItem("idToken");
  const [promotion, setPromotion] = useState({
    name: "",
    quantity: 0,
    availableFrom: "",
    availableTo: "",
    discount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole === "admin") {
        fetchPromotionDetails();
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const fetchPromotionDetails = async () => {
    try {
      const response = await axios.get(
        `https://service.dev.grp6asm3.com/promotion/codes/${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setPromotion({
        name: data.name,
        quantity: data.quantity,
        availableFrom: data.availableFrom.split("T")[0], // Format as yyyy-mm-dd
        availableTo: data.availableTo.split("T")[0],
        discount: data.discount * 100, // Convert to percentage
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching promotion details:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleUpdatePromotion = async () => {
    try {
      const updatedData = {
        ...promotion,
        discount: promotion.discount / 100, // Convert back to decimal
        availableFrom: new Date(promotion.availableFrom).toISOString(),
        availableTo: new Date(promotion.availableTo).toISOString(),
      };

      await axios.put(
        `https://service.dev.grp6asm3.com/promotion/codes/${code}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Promotion updated successfully!");
      navigate("/admin/promotion-codes");
    } catch (error) {
      console.error("Error updating promotion:", error);
      alert("Failed to update promotion.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Update Promotion Code
          </Typography>

          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={promotion.name}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                name="quantity"
                value={promotion.quantity}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Discount */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                name="discount"
                value={promotion.discount}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Available From */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Available From"
                type="date"
                name="availableFrom"
                value={promotion.availableFrom}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Available To */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Available To"
                type="date"
                name="availableTo"
                value={promotion.availableTo}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/promotions")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdatePromotion}
                >
                  Update Promotion
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdatePromotionCodePage;
