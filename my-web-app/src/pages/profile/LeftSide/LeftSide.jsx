import React, { useEffect, useState } from 'react';
import './leftside.scss';
import { useNavigate } from "react-router-dom";
import { getProfileDetailAPI } from '../../../apis/profile.api.js';
import useAuth from '../../../hooks/useAuth.js';

const LeftSide = ({ setActiveSection }) => {
    const [username, setUsername] = useState();
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null); // Reset error state before fetching
            try {
                const userProfile = await getProfileDetailAPI(); // Fetch user profile from API
                setUsername(userProfile.userName || 'User '); // Set username
                //setProfileImage(userProfile.profileImage || 'https://via.placeholder.com/150'); // Set profile image
            } catch (err) {
                setError('Failed to load user profile.'); // Set error message
                console.error(err);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            setIsLoading(true);
            localStorage.removeItem('idToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('checkoutData');
            localStorage.removeItem('username');
            navigate("/"); // Redirect to homepage
            window.location.reload();
        }
        setIsLoading(false);
    };

    return (
        <div className="left-side flex flex-col space-y-6 p-4">
            {/* Profile Section */}
            <div className="rounded-sm profile flex flex-row items-center space-x-4 bg-white p-4 shadow hover:shadow-lg transition-shadow duration-300">
                <div className="overflow-hidden break-words">
                    <p className="font-intel text-lg text-gray-500">Hi,</p>
                    <h1 className="font-akshar font-bold text-2xl text-gray-800">{username}</h1>
                </div>
            </div>


            {/* Navigation Options */}
            <div className="navigation flex flex-col space-y-4">
                <div
                    onClick={() => setActiveSection(1)}
                    className="rounded-sm nav-item flex items-center space-x-4 p-4 px-6 bg-white shadow hover:bg-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
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

                <>
                    {userRole && userRole !== "admin" && (
                        <div
                            onClick={() => setActiveSection(2)}
                            className="rounded-sm nav-item flex items-center space-x-4 p-4 px-6 bg-white shadow hover:bg-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="w-6 h-6 text-gray-600"
                            >
                                <path d="M50.7 58.5L0 160l208 0 0-128L93.7 32C75.5 32 58.9 42.3 50.7 58.5zM240 160l208 0L397.3 58.5C389.1 42.3 372.5 32 354.3 32L240 32l0 128zm208 32L0 192 0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-224z" />
                            </svg>
                            <p className="font-intel text-lg text-gray-700 hover:font-bold">My Orders</p>
                        </div>)}</>
            </div>

            <div className="flex justify-center items-center">
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    aria-label="Logout"
                    className={`flex justify-center items-center text-center font-intel rounded-sm w-full nav-item space-x-4 p-4 text-gray-700 bg-gray-100 shadow hover:bg-gray-200 hover:shadow-md transition-all duration-300 ${isLoading ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default LeftSide;
