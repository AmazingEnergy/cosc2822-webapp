import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItemQuantity } from "../../../redux/slices/cart.slice.js";
import './shoppingcart.scss';

const ShoppingCart = () => {
  const dispatch = useDispatch();

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle updating quantity of a specific item
  const handleUpdateQuantity = (skuId, change) => {
    dispatch(updateItemQuantity({ skuId, change }));
  };

  // Handle removing an item
  const handleRemoveItem = (skuId) => {
    dispatch(removeItem(skuId));
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F5F5F5] p-4">
      {/* Header Outside the White Box */}
      <h1 className="title mb-6">My Shopping Cart</h1>

      {/* White Container */}
      <div className="bg-white p-8 shadow-lg w-full max-w-4xl">
        {/* Table Header */}
        <div className="grid grid-cols-5 font-semibold pb-2 border-b">
          <div className="col-span-2">Description</div>
          <div>Quantity</div>
          <div>Remove</div>
          <div className="text-right">Price</div>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="text-center text-lg text-gray-700 py-4" colSpan={5}>
            No items in cart
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.skuId}
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
                  onClick={() => handleUpdateQuantity(item.skuId, -1)}
                  className="w-8 h-8 bg-[#D9D9D9] text-black"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.skuId, 1)}
                  className="w-8 h-8 bg-[#E89F71] text-white"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemoveItem(item.skuId)}
                className="w-8 h-8 border border-solid text-black text-xl hover:text-red-500"
              >
                x
              </button>

              {/* Price */}
              <div className="text-right font-semibold">${item.price}</div>
            </div>
          ))
        )}

        {/* Total Section */}
        {cartItems.length > 0 && (
          <div className="flex justify-end align-middle space-x-4 items-center mt-6">
            <h2 className="text-lg font-semibold">Total</h2>
            <span className="text-xl font-bold">${totalPrice}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 mt-6">
          {cartItems.length === 0 ? (
            <button
              className="w-48 bg-[#E89F71] text-white py-2 cursor-not-allowed opacity-50"
              disabled
            >
              Checkout
            </button>
          ) : (
            <Link to="/cart/checkout">
              <button className="w-48 bg-[#E89F71] text-white py-2 hover:bg-[#B55E5E] transition">
                Checkout
              </button>
            </Link>
          )}
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
