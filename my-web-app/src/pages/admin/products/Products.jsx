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

const Products = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    await axios
      .get("https://service.sandbox.grp6asm3.com/products")
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
  };

  useEffect(() => {
    if (isAuthenticated && userRole !== undefined) {
      if (userRole === "admin") {
        fetchProducts();
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleCreateProduct = () => {
    navigate("/admin/create-product");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            Products
          </Typography>
          <Button
            variant="contained"
            // color="secondary"
            onClick={handleCreateProduct}
          >
            + Create Product
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by product name ..."
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
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/products/${product.skuId}`)
                      }
                    >
                      {product.name}
                    </Button>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Products;
