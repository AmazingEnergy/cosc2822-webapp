import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { submitCart, loadCartFromAPI, clearCart } from '../../../redux/slices/cart.slice.js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
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

  const validateForm = () => {
    let errorMessages = {};
    let isValid = true;

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
    if (!contactPhone) {
      isValid = false;
      errorMessages.phone = "Phone number is required";
    }

    setErrors(errorMessages);
    setIsFormValid(isValid);
    return isValid;
  };

  const handlePaymentClick = () => {
    if (validateForm()) {
      // Navigate to the payment page
      navigate('payment', { state: { cartId, totalPrice, email, firstName, lastName, address, contactPhone } });
    }
  };

  const handleConfirmation = async () => {
    if (validateForm()) {
      if (cartId) {
        const contactName = `${firstName} ${lastName}`;
        const payload = { 
          cartId, 
          contactName, 
          email, 
          address,
          contactPhone
        };
        console.log('Submitting cart with payload:', payload); // Log the payload
  
        try {
          await dispatch(submitCart(payload)).unwrap();
          setIsModalOpen(true);
          localStorage.removeItem("cartId");
          dispatch(clearCart());
        } catch (error) {
          console.error('Error submitting cart:', error);
        }
      } else {
        console.error("cartId is not available");
      }
    }
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
    navigate("/"); // Navigate back to the homepage
  };

  const handleViewOrder = () => {
    setIsModalOpen(false);
    navigate("/profile");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F5F5F5] p-4">
      <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg border border-solid overflow-hidden">
        {/* Left Section */}
        <div className="w-2/3 bg-gray-100 p-8">
          {/* Contact Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Contact</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Email"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="text"
                placeholder="Phone number"
                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
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
            {/* <CardElement className="border border-gray-300 p-4 rounded-md" /> */}
            {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
            <button
              className="bg-[#E89F71] text-white px-6 py-2 mt-4 hover:bg-orange-500"
              onClick={handlePaymentClick}
            >
              Proceed to Payment
            </button>
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
              disabled={isProcessing} // Disable button while processing
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
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
                  ${(parseFloat(item.productPrice) * item.quantity).toFixed(2)}
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
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#F9F1E7] bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-hidden={!isModalOpen}
        >
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center space-y-6 transform transition-transform duration-300">
            <div>
              <img
                className="h-24 w-24"
                src="/assets/check.png"
                alt="Checkmark Icon"
              />
            </div>
            <h2
              id="modalTitle"
              className="text-2xl text-[#008080] font-bold text-center"
            >
              Thank You For Your Order
            </h2>
            <p className="text-center text-gray-700">
              Your order has been successfully placed. You can continue shopping or review your orders.
            </p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={handleContinueShopping}
                className="bg-[#E89F71] text-white px-6 py-2 rounded-md hover:bg-orange-500 transition duration-200"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleViewOrder}
                className="bg-[#baa190] text-gray-600 px-6 py-2 rounded-md hover:bg-[#d1b7a0] transition duration-200"
              >
                View Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;