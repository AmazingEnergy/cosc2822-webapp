import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import useAuth from '../../hooks/useAuth.js';
import './product.scss';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/slices/cart.slice.js'; 
import './product.scss';

const ProductDetail = () => {
  const { skuId } = useParams(); // skuId from the URL params
  const { isAuthenticated, userRole } = useAuth();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://service.dev.grp6asm3.com/products/${skuId}`);
      setProduct(response.data); 
      setMainImage(response.data.imageUrls[0]); // Default to the first image
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || 'Something went wrong!';
      console.error('Error fetching product detail:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [skuId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found</div>;

  const handleAddToCart = () => {
    if (!isAuthenticated || userRole === 'admin') {
      setIsModalOpen(true);
      return;
    }

    const currentCartId = localStorage.getItem('cartId');

    const newItem = {
      skuId, 
      name: product.name,
      stockCode: product.stockCode,
      quantity,
      price: product.price,
    };

    // Dispatch addItemToCart action to the Redux store
    dispatch(addItemToCart({ cartId: currentCartId, newItem }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-white p-8 gap-6">
        <div className="flex flex-col items-center gap-4">
          <img
            src={mainImage}
            alt="Main Product"
            className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover transform hover:scale-105 transition-transform duration-300"
          />

          {/* Thumbnails */}
          <div className="flex gap-4">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product Thumbnail ${index + 1}`}
                onClick={() => setMainImage(url)}
                className={`w-16 h-16 rounded-lg shadow-md object-cover cursor-pointer transform transition-transform duration-300 
                  ${mainImage === url ? "border-2 border-blue-500" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-start p-4">
          <h1 className="text-4xl font-akshar font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="font-intel text-2xl text-[#D07373] font-semibold mb-4">
            $ {product.price.toFixed(2)}
          </p>

          {/* Description */}
          <div className="text-black text-sm leading-relaxed mb-4">
            <h3 className="text-base font-semibold mb-2">
              Product Description:
            </h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity selection */}
          <div className="flex items-center gap-4 mb-4">
            <label
              htmlFor="quantity"
              className="text-black font-semibold text-sm"
            >
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="px-2 py-1 text-sm border rounded-lg focus:ring focus:ring-blue-300"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-[#D07373] text-white font-bold text-sm px-4 py-2 rounded-lg shadow-lg hover:bg-[#B55E5E] transition duration-300 focus:ring-4 focus:ring-blue-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

       {/* Modal */}
       {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full">
      {/* Close Button */}
      <div className="flex justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-6 w-6 cursor-pointer"
          onClick={handleCloseModal}
          aria-label="Close Modal"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
        </svg>
      </div>

      {/* Modal Content */}
      <h2 className="font-akshar text-[30px] text-center mb-4">Please Log In</h2>
      <p className="font-intel text-sm text-center mb-6">
        {userRole === 'admin'
          ? 'You need to be logged in to a customer account to add products to the cart.'
          : 'You need to be logged in to add products to the cart.'}
      </p>

      {/* Log In Button */}
      <div className="flex justify-center">
        <Link to="/login">
          <button className="font-intel login-btn bg-[#D07373] text-white px-4 py-2 rounded-lg hover:bg-[#B55E5E] transition duration-300">
            Log In
          </button>
        </Link>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ProductDetail;