import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
    // Sample cart data
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "abcdefg",
            price: 20,
            quantity: 5,
            image: "https://via.placeholder.com/80", // Placeholder for image
        },
        {
            id: 2,
            name: "abcdefg",
            price: 20,
            quantity: 5,
            image: "https://via.placeholder.com/80", // Placeholder for image
        },
    ]);

    // Function to handle quantity update
    const updateQuantity = (id, change) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    // Function to handle removing an item
    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Calculate total price
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F5F5F5] p-4">
            {/* Header Outside the White Box */}
            <h1 className="text-2xl font-bold text-center mb-6">My Shopping Cart</h1>

            {/* White Container */}
            <div className="bg-white p-8  shadow-lg w-full max-w-4xl">
                {/* Table Header */}
                <div className="grid grid-cols-5 font-semibold pb-2 border-b">
                    <div className="col-span-2">Description</div>
                    <div>Quantity</div>
                    <div>Remove</div>
                    <div className="text-right">Price</div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-5 items-center gap-4 py-4 border-b"
                    >
                        {/* Description */}
                        <div className="col-span-2 flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 bg-gray-200"
                            />
                            <span className="text-gray-700">{item.name}</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 bg-[#D9D9D9] text-black"
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 bg-[#E89F71] text-white"
                            >
                                +
                            </button>
                        </div>

                        {/* Remove */}

                        <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 border border-solid text-black text-xl hover:text-red-500"
                        >
                            x
                        </button>

                        {/* Price */}
                        <div className="text-right font-semibold">${item.price}</div>
                    </div>
                ))}

                {/* Total Section */}
                <div className="flex justify-end align-middle space-x-4 items-center mt-6">
                    <h2 className="text-lg font-semibold">Total</h2>
                    <span className="text-xl font-bold">${totalPrice}</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-center gap-4 mt-6">
                    <Link to="/checkout">
                        <button className="w-48 bg-[#E89F71] text-white py-2 hover:bg-[#B55E5E] transition">
                            Checkout
                        </button>
                    </Link>
                    <Link to="/">
                        <button className="w-48 border border-[#E89F71] py-2 text-gray-700 hover:bg-gray-100">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
