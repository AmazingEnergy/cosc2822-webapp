import React, { useState } from "react";
import { Box, TextField, Typography, Button, Paper, Grid } from "@mui/material";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const CreatePromotionCodePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const token = localStorage.getItem("idToken");

  const [promotion, setPromotion] = useState({
    code: "",
    name: "",
    quantity: 0,
    availableFrom: "",
    availableTo: "",
    discount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      if (value > 1) {
        alert("Discount cannot exceed 1 (<= 1).");
        return;
      }
    }

    setPromotion({ ...promotion, [name]: value });
  };

  const handleCreatePromotion = async () => {
    try {
      const newPromotionData = {
        ...promotion,
        discount: promotion.discount,
        availableFrom: new Date(promotion.availableFrom).toISOString(),
        availableTo: new Date(promotion.availableTo).toISOString(),
      };

      await axios.post(
        "https://service.sandbox.grp6asm3.com/promotion/codes",
        newPromotionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Promotion code created successfully!");
      navigate("/admin/promotion-codes");
    } catch (error) {
      console.error("Error creating promotion code:", error);
      alert("Failed to create promotion code.");
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create Promotion Code
          </Typography>

          <Grid container spacing={3}>
            {/* Code */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={promotion.code}
                onChange={handleInputChange}
                required
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={promotion.name}
                onChange={handleInputChange}
                required
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
                required
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
                inputProps={{ max: 1, step: 0.01 }}
                required
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
                required
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
                required
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/promotion-codes")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreatePromotion}
                >
                  Create Promotion
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreatePromotionCodePage;
