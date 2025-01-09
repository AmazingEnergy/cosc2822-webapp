import "./home.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]); // State for products
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Initialize useNavigate

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === "") {
      // Reset products to the original list if the search query is empty
      setProducts(originalProducts);
    } else {
      // Filter products based on the search query
      const filteredProducts = originalProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery);

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update the state with filtered products
    setProducts(filteredProducts);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event); // Call the submit function on Enter key press
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://service.sandbox.grp6asm3.com/products"
      );
      setOriginalProducts(response.data.items || []); // Store original products
      setProducts(response.data.items || []); // Set products to display
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (skuId) => {
    navigate(`/products/${skuId}`); // Navigate to product detail page
  };

  return (
    <div className="home-container">
      <div className="m-4 flex justify-end">
        <form className="flex items-center" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
        </form>
      </div>

      <h1 className="title mt-2">Our Products</h1>

      {loading ? (
        <div>Loading...</div> // Show loading spinner or message
      ) : error ? (
        <div className="error-message">{error}</div> // Show error message if fetching fails
      ) : products.length === 0 ? (
        <div>No product available</div> // Show message when no products exist
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.skuId}
              className="product-card"
              onClick={() => handleProductClick(product.skuId)} // Navigate on click
            >
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="product-image"
              />

              <div className="product-info">
                <div className="product-name font-intel">{product.name}</div>
                <div className="product-price font-intel">
                  $ {product.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
