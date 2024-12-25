import React, { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartId, totalPrice, email, firstName, lastName, address, contactPhone } = location.state || {};

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(`/api/carts/${cartId}/pay `, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: totalPrice * 100 }), // Amount in cents
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        setPaymentError(error.message);
      }
    };

    if (cartId) {
      fetchClientSecret();
    }
  }, [cartId, totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Stripe.js has not loaded yet.");
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`, // Redirect back to checkout after payment
      },
    });

    if (result.error) {
      setPaymentError(result.error.message);
    } else {
      // Payment succeeded, navigate to the checkout page
      navigate('/checkout');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {paymentError && <p className="text-red-500">{paymentError}</p>}
      <button type="submit" disabled={!stripe}>Submit Payment</button>
    </form>
  );
};

export default Payment;