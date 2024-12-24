import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadCartFromAPI, removeItemFromCart, updateItemQuantity} from "../../../redux/slices/cart.slice.js";
import './shoppingcart.scss';

const ShoppingCart = () => {
  const dispatch = useDispatch();

  // Get cart items from Redux store
  const cartItems = useSelector((state) => {
    //console.log("Redux State:", state.cart); // Log the entire cart state
    return state.cart.items || [];
  });

  // Log the cart items
  //console.log("cartItems:", cartItems); // Log the entire array

  // Retrieve cartId from localStorage
  const cartId = localStorage.getItem("cartId");

  useEffect(() => {
    if (cartId) {
      dispatch(loadCartFromAPI());
    }
  }, [dispatch, cartId]);


  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.productPrice) || 0;
    const quantity = parseInt(item.quantity, 10) || 0;
    return total + price * quantity;
  }, 0);

  // Define handleUpdateQuantity function
  const handleUpdateQuantity = (skuId, change) => {
    if (cartId) {
      const item = cartItems.find(item => item.skuId === skuId);
      if (item) {
        const newQuantity = item.quantity + change;

        if (newQuantity >= 0) {
          // Optimistically update the state
          dispatch(updateItemQuantity({ cartId, skuId, quantity: newQuantity }));

          // Call the API to update the quantity
          dispatch(updateItemQuantity({ cartId, skuId, quantity: newQuantity }));
        } else {
          console.error("Quantity cannot be negative");
        }
      } else {
        console.error("Item not found in cart");
      }
    } else {
      console.error("cartId is not available");
    }
  };

  // Handle removing an item
  const handleRemoveItem = (skuId) => {
    if (cartId) {
      // Optimistically remove the item from the state
      const updatedItems = cartItems.filter(item => item.skuId !== skuId);
      dispatch(removeItemFromCart({ cartId, itemId: skuId }));

      // Update the state immediately
      dispatch({
        type: 'cart/removeItemOptimistically',
        payload: updatedItems,
      });
    } else {
      console.error("cartId is not available");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F5F5F5] p-4">
      {/* Header Outside the White Box */}
      <h1 className="title mb-6">My Shopping Cart</h1>

      {/* White Container */}
      <div className="bg-white p-8 shadow-lg w-full max-w-4xl">
        {/* Table Header */}
        <div className="grid grid-cols-5 font-semibold pb-2 border-b">
          <div className="col-span-2">Product Name</div>
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
              {/* Product Name */}
              <div className="col-span-2 flex items-center gap-4">
                {/* <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 bg-gray-200"
                /> */}
                <span className="text-gray-700">{item.productName}</span>
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
              <div className="text-right font-semibold">${(parseFloat(item.productPrice) * item.quantity).toFixed(2)}</div>
            </div>
          ))
        )}

        {/* Total Section */}
        {cartItems.length > 0 && (
          <div className="flex justify-end align-middle space-x-4 items-center mt-6">
            <h2 className="text-lg font-semibold">Total</h2>
            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
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
            <Link to="pay">
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
