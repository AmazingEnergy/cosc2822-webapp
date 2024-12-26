import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const Return = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const location = useLocation();
    const { orderStatus } = location.state || { orderStatus: 'No order status available' };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        console.log("session_id=" +sessionId );

        fetch(`/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                //setCustomerEmail(data.customer_email);
            });
    }, []);

    const handleContinueShopping = () => {
        navigate("/"); // Navigate back to the homepage
      };
    
      const handleViewOrder = () => {
        navigate("/profile");
      };

    if (status === 'open') {
        return (
            <Link to="/checkout" />
        )
    }

    if (status === 'complete') {
        return (
            <section id="success">
                <div
                    className="fixed inset-0 bg-[#F9F1E7] bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
                    role="dialog"
                    aria-labelledby="modalTitle"
                    //aria-hidden={!isModalOpen}
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
            </section>
        )
    }

    return null;
}

export default Return;