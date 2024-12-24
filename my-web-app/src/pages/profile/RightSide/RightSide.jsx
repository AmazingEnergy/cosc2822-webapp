import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth.js';
import { listOrdersAPI, cancelOrderAPI, getOrderDetailAPI } from '../../../apis/order.api.js';
import './rightside.scss';

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
    const [orderDetails, setOrderDetails] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); 
    const [cancelReason, setCancelReason] = useState(''); 

    useEffect(() => {
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

                if (data && data.email) {
                    setProfile({
                        username: data.customerId || 'N/A',
                        email: data.email,
                        firstname: data.firstName || '',
                        lastname: data.lastName || '',
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

    useEffect(() => {
        if (activeSection === 2 && idToken) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const data = await listOrdersAPI();
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

    const handleCancelOrder = async (orderId) => {
        if (!cancelReason) {
            alert("Please provide a reason for canceling the order.");
            return;
        }
    
        try {
            await cancelOrderAPI(orderId, cancelReason);
            alert('Order canceled successfully!');
            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
            setIsCancelModalOpen(false); // Close the modal after successful cancellation
            setCancelReason(''); // Reset the reason
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order. Please try again later.');
        }
    };

    const handleOrderClick = async (orderId) => {
        if (selectedOrderId === orderId) {
            setSelectedOrderId(null);
            setOrderDetails(null);
        } else {
            try {
                const details = await getOrderDetailAPI(orderId);
                setOrderDetails(details);
                setSelectedOrderId(orderId);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
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
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white shadow-lg p-4 rounded-xl space-y-2 cursor-pointer" onClick={() => handleOrderClick(order.id)}>
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-600">Order Number:</p>
                                <p className="text-lg font-bold text-green-600">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Status: <span className="font-medium">{order.status}</span></p>
                                <p className="text-sm text-gray-500">Order Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                <p className="text-sm text-gray-500">Total Amount: <span className="font-medium">${order.totalAmount}</span></p>
                            </div>
                            {selectedOrderId === order.id && orderDetails && (
                                <div className="mt-2">
                                    <h2 className="text-lg font-semibold">Order Items:</h2>
                                    <ul className="list-disc pl-5">
                                        {orderDetails.orderItems.map(item => (
                                            <li key={item.id} className="text-sm text-gray-600">
                                                {item.productName} - Quantity: {item.quantity} - Price: ${item.productPrice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {order.status === 'new' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsCancelModalOpen(true); // Open the cancel modal
                                            setSelectedOrderId(order.id); // Set the selected order ID
                                        }}
                                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600 text-center">No orders found.</p>
            )}
        </div>
    );

    const renderCancelModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
                <p>Please provide a reason for canceling the order:</p>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 mt-2"
                    rows="4"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter your reason here..."
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsCancelModalOpen(false)}
                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleCancelOrder(selectedOrderId)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {activeSection === 1 && renderPersonalInfo()}
            {activeSection === 2 && renderOrders()}
            {isCancelModalOpen && renderCancelModal()}
        </div>
    );
};

export default RightSide;