import React, { useState, useEffect } from 'react';
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

const RightSide = ({ activeSection, currentUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Fetch user profile on mount or currentUser change
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser || !currentUser.id_token) return;

            setLoadingProfile(true);
            try {
                const response = await fetch('https://service.dev.grp6asm3.com/profile', {
                    headers: {
                        Authorization: `Bearer ${currentUser.id_token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
                }

                const data = await response.json();
                setUsername(data.username || '');
                setEmail(data.email || '');
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('Failed to fetch user profile. Please try again later.');
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    // Fetch orders when activeSection changes to 2
    useEffect(() => {
        if (activeSection === 2) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const response = await fetch('https://service.dev.grp6asm3.com/orders', {
                        headers: {
                            Authorization: `Bearer ${currentUser.id_token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch orders: ${response.statusText}`);
                    }

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
    }, [activeSection, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        console.log('Updated:', { username, email, password });
        setPassword('');
    };

    const renderPersonalInfo = () => (
        <div className="w-full bg-white shadow-xl p-6 space-y-6 rounded-lg max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 text-center">My Personal Information</h1>
            {loadingProfile ? (
                <p className="text-lg text-gray-600 text-center">Loading profile...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 gap-4">
                    <div>
                        <label htmlFor="username" className="block text-sm text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between space-x-6">
                        <button
                            type="button"
                            onClick={() => {
                                setUsername(currentUser.username);
                                setEmail(currentUser.email);
                                setPassword('');
                            }}
                            className="w-full py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
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
