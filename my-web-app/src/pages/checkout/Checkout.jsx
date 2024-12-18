import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Use the navigate hook

  // Function to open the modal
  const handleConfirmation = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal and redirect
  const handleContinueShopping = () => {
    setIsModalOpen(false);
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F5F5F5] p-4">
      <div className="bg-white flex shadow-lg w-full max-w-6xl rounded-lg">
        {/* Left Section */}
        <div className="w-2/3 p-8 bg-gray-100 border-r">
          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <input
              type="email"
              placeholder="Email or mobile phone number"
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Delivery */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery</h2>
            <input
              type="text"
              placeholder="Region"
              className="w-full border p-2 rounded-md mb-4"
            />
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 border p-2 rounded-md"
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Shipping Method */}
          <div>
            <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
            <div className="flex justify-between items-center border p-4 rounded-md bg-white">
              <span>EasyShop Shipping</span>
              <span className="font-semibold">$0</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-start gap-4 mt-8">
            <button className="border border-gray-400 px-6 py-2 rounded-md text-gray-600 hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={handleConfirmation}
              className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-500"
            >
              Confirmation
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-8">
          {/* Cart Item */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
            <div className="flex-1">
              <h3 className="text-sm">abcdefg</h3>
            </div>
            <span className="font-semibold">$20</span>
          </div>

          {/* Shipping Cost */}
          <div className="flex justify-between border-t py-4">
            <span>Shipping</span>
            <span>$0</span>
          </div>

          {/* Total */}
          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">$200</span>
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
              <img className="h-[137px] w-[137px]" src="./assets/check.png" alt="Checkmark Icon" />
            </div>
            <h2
              id="modalTitle"
              className="text-2xl text-[#008080] font-bold mb-4"
            >
              Thank You For Your Order
            </h2>
            <p className="mb-6">Your order has been successfully placed. You can continue shopping or review your orders.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#E89F71] text-white px-6 py-2 hover:bg-orange-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
