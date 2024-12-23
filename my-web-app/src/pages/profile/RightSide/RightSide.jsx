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

    useEffect(() => {
        // Fetch new orders when activeSection changes to 2
        if (activeSection === 2 && idToken) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const data = await listOrdersAPI(); // Use the new API function
                    //console.log("Orders fetched:", JSON.stringify(data, null, 2)); // Log the new orders
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
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                // Call the cancel order API function
                await cancelOrderAPI(orderId);
                alert('Order canceled successfully!');
                // Optionally, refresh the orders list or update the state
                setOrders((prevOrders) =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, status: 'cancelled' } : order
                    )
                );
            } catch (error) {
                console.error('Error canceling order:', error);
                alert('Failed to cancel order. Please try again later.');
            }
        }
    };

    const handleOrderClick = async (orderId) => {
        if (selectedOrderId === orderId) {
            // If the same order is clicked, toggle the detail view off
            setSelectedOrderId(null);
            setOrderDetails(null);
        } else {
            // Fetch order details
            try {
                const details = await getOrderDetailAPI(orderId);
                setOrderDetails(details); // Set the order details
                setSelectedOrderId(orderId); // Set the selected order ID
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }
    };

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
                            {/* Show order items if this order is selected */}
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
                            {/* Cancel Order Button */}
                            {order.status === 'new' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the order click
                                            handleCancelOrder(order.id);
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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {activeSection === 1 && renderPersonalInfo()}
            {activeSection === 2 && renderOrders()}
        </div>
    );
};

export default RightSide;