import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth.js';
import './rightside.scss';

const OrderCard = ({ orderStatus, orderNo, orderDate }) => (
    <div className="bg-white shadow-lg p-4 rounded-xl space-y-2 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center space-x-2">
            <p className="text-lg font-semibold text-gray-600">ORDER STATUS:</p>
            <p className="text-lg font-bold text-green-600">{orderStatus}</p>
        </div>
        <hr className="my-2" />
        <div>
            <p className="text-sm text-gray-500">ORDER NO: <span className="font-medium">{orderNo}</span></p>
            <p className="text-sm text-gray-500">ORDER DATE: <span className="font-medium">{orderDate}</span></p>
        </div>
    </div>
);

const RightSide = ({ activeSection }) => {
    const { idToken } = useAuth();
    const [profile, setProfile] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
    });
    const [orders, setOrders] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        // Fetch user profile on mount or when idToken changes
        const fetchUserProfile = async () => {
            const token = idToken || localStorage.getItem('idToken');
            if (!token) {
                console.error("No id_token found");
                setLoadingProfile(false);
                return;
            }

            setLoadingProfile(true);
            try {
                const response = await fetch('https://service.dev.grp6asm3.com/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error(`Failed to fetch user profile: ${response.statusText}`);

                const data = await response.json();
                //console.log('API Response:', data); // Log the raw response for debugging

                // Update profile with the new data structure
                if (data && data.email) {
                    setProfile({
                        username: data.customerId || 'N/A', // Using customerId as a substitute for username
                        email: data.email,
                        firstname: data.firstName || '', // If firstName is empty, default to an empty string
                        lastname: data.lastName || '', // If lastName is empty, default to an empty string
                    });
                } else {
                    throw new Error("Invalid profile data received");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                alert(`Error fetching user profile: ${error.message}`);
            } finally {
                setLoadingProfile(false);
            }
        };


        fetchUserProfile();
    }, [idToken]);

    useEffect(() => {
        // Fetch orders when activeSection changes to 2
        if (activeSection === 2 && idToken) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const response = await fetch('https://service.dev.grp6asm3.com/orders', {
                        headers: { Authorization: `Bearer ${idToken}` },
                    });
                    if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);

                    const data = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    setOrders([]);
                } finally {
                    setLoadingOrders(false);
                }
            };

            fetchOrders();
        }
    }, [activeSection, idToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://service.dev.grp6asm3.com/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    email: profile.email,
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    password: profile.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }

            const data = await response.json();
            setProfile({
                ...profile,
                firstname: data.firstname || 'Not Provided',
                lastname: data.lastname || 'Not Provided',
                username: data.username || 'Not Provided',
                email: data.email || profile.email,
                password: '', // Clear password field
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again later.');
        }
    };

    const renderPersonalInfo = () => (
        <div className="w-full bg-white shadow-xl p-6 space-y-6 rounded-lg max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 text-center">My Personal Information</h1>
            {loadingProfile ? (
                <p className="text-lg text-gray-600 text-center">Loading profile...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your username"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        />
                    </div>

                    {/* Firstname and Lastname */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Firstname</label>
                            <input
                                type="text"
                                id="firstname"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter your firstname"
                                value={profile.firstname}
                                onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Lastname</label>
                            <input
                                type="text"
                                id="lastname"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter your lastname"
                                value={profile.lastname}
                                onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your password"
                            value={profile.password}
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setProfile({ ...profile, password: '' })}
                            className="w-full py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Save
                        </button>
                    </div>
                </form>

            )}
        </div>
    );

    const renderOrders = () => (
        <div className="w-full space-y-4">
            <div className="bg-white p-4 shadow rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">My Orders</h1>
            </div>
            {loadingOrders ? (
                <p className="text-lg text-gray-600 text-center">Loading orders...</p>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <OrderCard
                            key={index}
                            orderStatus={order.orderStatus}
                            orderNo={order.orderNo}
                            orderDate={order.orderDate}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600 text-center">No orders found.</p>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {activeSection === 1 && renderPersonalInfo()}
            {activeSection === 2 && renderOrders()}
        </div>
    );
};

export default RightSide;
