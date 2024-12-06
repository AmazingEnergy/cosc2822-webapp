import React from 'react';
import './leftside.scss';

const LeftSide = ({ firstname = 'User', profileImage = 'https://via.placeholder.com/150', setActiveSection}) => {
    return (
        <div className="left-side flex flex-col space-y-6 p-4">
            {/* Profile Section */}
            <div className="profile flex flex-row items-center space-x-4 bg-white p-4 shadow hover:shadow-lg transition-shadow duration-300">
                <img
                    src={profileImage}
                    alt={`${firstname}'s Profile`}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                    <p className="font-intel text-lg text-gray-500">Hi,</p>
                    <h1 className="font-akshar font-bold text-2xl text-gray-800">{firstname}</h1>
                </div>
            </div>

            {/* Navigation Options */}
            <div className="navigation flex flex-col space-y-4">
                {/* Personal Information */}
                <div
                    onClick={() => setActiveSection(1)}
                    className="nav-item flex items-center space-x-4 p-4 px-6 bg-white  shadow hover:bg-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-6 h-6 text-gray-600"
                    >
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                    </svg>
                    <p className="font-intel text-lg text-gray-700 hover:font-bold">My Personal Information</p>
                
                </div>

                {/* Orders */}
                <div
                    onClick={() => setActiveSection(2)}
                    className="nav-item flex items-center space-x-4 p-4 px-6 bg-white shadow hover:bg-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-6 h-6 text-gray-600"
                    >
                        <path d="M50.7 58.5L0 160l208 0 0-128L93.7 32C75.5 32 58.9 42.3 50.7 58.5zM240 160l208 0L397.3 58.5C389.1 42.3 372.5 32 354.3 32L240 32l0 128zm208 32L0 192 0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-224z" />
                    </svg>
                    <p className="font-intel text-lg text-gray-700 hover:font-bold">My Orders</p>
                </div>
            </div>
        </div>
    );
};

export default LeftSide;
