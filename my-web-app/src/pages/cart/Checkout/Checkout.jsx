import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../../redux/slices/cart.slice.js'; 
const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({}); // Store individual error messages
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Validate the form
  const validateForm = () => {
    let errorMessages = {};
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      isValid = false;
      errorMessages.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      errorMessages.email = "Please enter a valid email address";
    }

    if (!firstName) {
      isValid = false;
      errorMessages.firstName = "First name is required";
    }
    if (!lastName) {
      isValid = false;
      errorMessages.lastName = "Last name is required";
    }
    if (!address) {
      isValid = false;
      errorMessages.address = "Address is required";
    }

    setErrors(errorMessages);
    setIsFormValid(isValid);
    return isValid;
  };

  // Function to open the modal
  const handleConfirmation = () => {
    if (validateForm()) {
      setIsModalOpen(true);
      
      // Clear the cart and localStorage after successful checkout
      localStorage.removeItem("cart"); // Remove cart from localStorage
      dispatch(clearCart()); // Dispatch action to clear the Redux cart store
    }
  };

  // Function to close the modal and redirect
  const handleContinueShopping = () => {
    setIsModalOpen(false);
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F5F5F5] p-4">
      <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg border border-solid overflow-hidden">
        {/* Left Section */}
        <div className="w-2/3 bg-gray-100 p-8">
          {/* Contact Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Contact</h2>
            <input
              type="text"
              placeholder="Email"
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Delivery Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Delivery</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First name"
                className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} 
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

              <input
                type="text"
                placeholder="Last name"
                className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} 
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

              <input
                type="text"
                placeholder="Address"
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md col-span-2`}
                value={address}
                onChange={(e) => setAddress(e.target.value)} 
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Shipping Method</h2>
            <div className="flex items-center justify-between border border-gray-300 p-4 rounded-md bg-white">
              <span>EasyShop Shipping</span>
              <span className="font-semibold">$0</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Payment Method</h2>
            <div className="flex items-center justify-between border border-gray-300 p-4 rounded-md bg-white">
              {/* Payment method fields can be added here */}
            </div>
          </div>

          {/* Error Message */}
          {!isFormValid && (
            <div className="text-red-500 mb-4">Please fill out all required fields.</div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to="/carts">
              <button className="border border-[#E89F71] px-6 py-2 text-gray-600 hover:bg-gray-200">
                Cancel
              </button>
            </Link>
            <button
              className="bg-[#E89F71] text-white px-6 py-2 hover:bg-orange-500"
              onClick={handleConfirmation}
            >
              Confirmation
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-8 bg-white">
          {/* Cart Items */}
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <p className="text-sm">{item.name}</p>
                </div>
                <span className="font-semibold text-gray-800">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}

          {/* Shipping Row */}
          <div className="flex justify-between py-4 border-t">
            <span>Shipping</span>
            <span>$0</span>
          </div>

          {/* Total Row */}
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg">${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#F9F1E7] flex justify-center items-center z-50"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-hidden={!isModalOpen}
        >
          <div className="bg-white p-8 rounded-lg w-[718px] h-[586px] flex flex-col items-center justify-center space-y-4">
            <div>
              <img
                className="h-[137px] w-[137px]"
                src="/assets/check.png" alt="Checkmark Icon" />
            </div>
            <h2
              id="modalTitle"
              className="text-2xl text-[#008080] font-bold mb-4"
            >
              Thank You For Your Order
            </h2>
            <p className="mb-6">Your order has been successfully placed. You can continue shopping or review your orders.</p>
            <div className="pt-8">
              <button
                onClick={handleContinueShopping}
                className="bg-[#E89F71]  text-white px-6 py-2 hover:bg-orange-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
