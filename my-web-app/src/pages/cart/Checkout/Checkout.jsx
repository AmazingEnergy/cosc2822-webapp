import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getPayClientSecretAPI } from '../../../apis/cart.api.js';
import { submitCart, loadCartFromAPI, clearCart } from '../../../redux/slices/cart.slice.js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const testKey = import.meta.env.VITE_TEST_KEY;
const stripePromise = loadStripe(testKey);

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(true); // Loading state
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false); // State to control visibility of EmbeddedCheckout

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartId = localStorage.getItem("cartId");

  // Fetch the client secret when the component mounts
  const fetchClientSecret = useCallback(async () => {
    if (!cartId) return; // Ensure cartId is available
    try {
      const response = await getPayClientSecretAPI(cartId);
      if (response.clientSecret) {
        setClientSecret(response.clientSecret); // Set the client secret
      } else {
        console.error('Client secret is missing in the response.');
        setPaymentError("Client secret is missing.");
      }
    } catch (error) {
      console.error('Error fetching client secret:', error.message);
      setPaymentError("Failed to fetch payment information.");
    } finally {
      setLoadingClientSecret(false); // Set loading to false after fetching
    }
  }, [cartId]);

  useEffect(() => {
    fetchClientSecret(); // Fetch client secret when cartId is available
    if (cartId) {
      dispatch(loadCartFromAPI());
    }
  }, [fetchClientSecret, dispatch, cartId]);

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

  const handleApplyCode = () => {
    const code = document.querySelector('input').value; 
    // Logic to apply the promotion code
    console.log(`Applying promotion code: ${code}`);
    // You can add your validation and application logic here
  };

  const handleConfirmation = async (event) => {
    event.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) return;

    // Check if Stripe and Elements are loaded
    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Stripe.js has not loaded yet or client secret is missing.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    //const cardElement = elements.getElement(CardElement);

    try {
      // // Create a payment method
      // const { error, paymentMethod } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: cardElement,
      //   billing_details: {
      //     email,
      //     name: `${firstName} ${lastName}`,
      //     address: {
      //       line1: address,
      //       phone: contactPhone,
      //     },
      //   },
      // });

      // // Handle any errors from creating the payment method
      // if (error) {
      //   setPaymentError(error.message);
      //   return; // Exit early if there's an error
      // }

      // Prepare payload for submitting the cart
      const payload = {
        cartId,
        contactName: `${firstName} ${lastName}`,
        email,
        address,
        contactPhone,
        //paymentMethodId: paymentMethod.id // Include the payment method ID
      };
      console.log('Submitting cart with payload:', payload); // Log the payload

      // Submit the cart
      await dispatch(submitCart(payload)).unwrap();

      // Navigate to the return page with order status
      navigate('/carts/return', { state: { orderStatus: 'Order submitted successfully!' } });

      // Clear local storage and Redux state
      localStorage.removeItem("cartId");
      dispatch(clearCart());
    } catch (error) {
      // Handle any errors that occur during the submission
      console.error('Error submitting cart:', error);
      setPaymentError("There was an error processing your payment.");
    } finally {
      // Reset processing state
      setIsProcessing(false);
    }
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

          {/* Promotion Method */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Promotion Code</h2>
            <div className="flex items-center justify-between border border-gray-300 p-4 rounded-md bg-white">
              <input
                type="text"
                placeholder="Enter your promotion code"
                className="flex-grow border-none outline-none"
              />
              <button
                className="ml-4 px-4 py-2 bg-[#E89F71] text-white hover:bg-orange-500"
                onClick={handleApplyCode} 
              >
                Apply
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Payment Method</h2>
            {loadingClientSecret ? (
              <p>Loading payment information...</p>
            ) : (
              <>
                {showEmbeddedCheckout ? (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                ) : (
                  <button
                    className="bg-[#E89F71] text-white px-6 py-2 hover:bg-orange-500"
                    onClick={() => setShowEmbeddedCheckout(true)}
                  >
                    Pay
                  </button>
                )}
                {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
              </>
            )}
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
              {isProcessing ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-8 bg-white">
          {/* Cart Items */}
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-6">
                {/* <div className="w-16 h-16 bg-gray-300 rounded"></div> */}
                <div className="flex-1">
                  <p className="text-sm text-black">{item.productName}</p>
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
            <span>Promotion code</span>
            <span>$20</span>
          </div>

          {/* Total Row */}
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
}