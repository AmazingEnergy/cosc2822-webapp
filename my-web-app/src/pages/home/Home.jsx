import './home.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import useAuth from '../../hooks/useAuth.js';

const Home = () => {
    // Mock data for products
    const products = [
        { id: 1, name: 'Product 1', price: '$25.00', image: 'https://via.placeholder.com/300' },
        { id: 2, name: 'Product 2', price: '$40.00', image: 'https://via.placeholder.com/300' },
        { id: 3, name: 'Product 3', price: '$15.00', image: 'https://via.placeholder.com/300' },
        { id: 4, name: 'Product 4', price: '$35.00', image: 'https://via.placeholder.com/300' },
        { id: 5, name: 'Product 5', price: '$55.00', image: 'https://via.placeholder.com/300' },
        { id: 6, name: 'Product 6', price: '$30.00', image: 'https://via.placeholder.com/300' },
        { id: 7, name: 'Product 7', price: '$45.00', image: 'https://via.placeholder.com/300' },
        { id: 8, name: 'Product 8', price: '$20.00', image: 'https://via.placeholder.com/300' },
    ];

    // User authentication state
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState([]); // State for shopping cart
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const navigate = useNavigate(); // Initialize useNavigate

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            setIsModalOpen(true); // Open the modal if not authenticated
            return;
        }

        // Check if product already exists in the cart
        const existingProductIndex = cart.findIndex((item) => item.id === product.id);

        if (existingProductIndex === -1) {
            // Product not in the cart, add to cart
            setCart([...cart, { ...product, quantity: 1 }]);
        } else {
            // Product already in the cart, increase quantity
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            setCart(updatedCart);
        }
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`); // Navigate to product detail page
    };

    return (
        <div className="home-container">
            <h1 className="title mt-2">Our Products</h1>

            <div className="product-grid">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => handleProductClick(product.id)} // Navigate on click
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">{product.price}</div>
                        </div>

                        <button 
                            className="add-to-cart-button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when adding to cart
                                handleAddToCart(product);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content flex flex-col space ```javascript
                    -y-5">
                        <div className='flex justify-end items-end' onClick={handleCloseModal}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 512 512" 
                                className='h-6 w-6'>
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                            </svg>
                        </div>
                        <h2 className='font-akshar text-[30px]'>Please Log In</h2>
                        <p className='font-intel text-sm'>You need to be logged in to add products to the cart.</p>
                        
                        <Link to="/login"> 
                            <button className="font-intel login-btn">Log In</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;