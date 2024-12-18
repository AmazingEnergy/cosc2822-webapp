import React from "react";

const Checkout = () => {
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
              placeholder="Email or mobile phone number"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {/* Delivery Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Delivery</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Region"
                className="w-full border border-gray-300 p-2 rounded-md col-span-2"
              />
              <input
                type="text"
                placeholder="First name"
                className="border border-gray-300 p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Last name"
                className="border border-gray-300 p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 p-2 rounded-md col-span-2"
              />
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

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="border border-[#E89F71] px-6 py-2 text-gray-600 hover:bg-gray-200">
              Cancel
            </button>
            <button className="bg-[#E89F71] text-white px-6 py-2 hover:bg-orange-500">
              Confirmation
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-8 bg-white">
          {/* Cart Item */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <p className="text-sm">abcdefg</p>
            </div>
            <span className="font-semibold text-gray-800">$20</span>
          </div>

          {/* Shipping Row */}
          <div className="flex justify-between py-4 border-t">
            <span>Shipping</span>
            <span>$0</span>
          </div>

          {/* Total Row */}
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg">$200</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
