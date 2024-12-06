import React, { useState } from 'react';
import './rightside.scss';

const OrderCard = ({ orderStatus, orderNo, orderDate }) => (
    <div className="bg-white shadow p-4 rounded-lg space-y-2">
        <div className="flex justify-between items-center space-x-2">
            <p className="text-lg font-semibold">ORDER STATUS:</p>
            <p className="text-lg font-bold text-green-600">{orderStatus}</p>
        </div>
        <hr className="my-2" />
        <div>
            <p className="text-sm">ORDER NO: <span className="font-medium">{orderNo}</span></p>
            <p className="text-sm">ORDER DATE: <span className="font-medium">{orderDate}</span></p>
        </div>
    </div>
);

const RightSide = ({ activeSection }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        console.log('Submitted:', { firstName, lastName, email, password });

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const orders = [
        { orderStatus: "IT'S ORDERED!", orderNo: 1676, orderDate: '06 Oct, 2024' },
        { orderStatus: "IT'S ORDERED!", orderNo: 1677, orderDate: '07 Oct, 2024' },
        { orderStatus: "IT'S ORDERED!", orderNo: 1678, orderDate: '08 Oct, 2024' },
    ];

    const renderPersonalInfo = () => (
        <div className="bg-white shadow p-6 space-y-6 rounded-lg">
            <h1 className="text-2xl font-akshar font-semibold text-gray-700 text-center">
                My Personal Information
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-intel text-gray-600">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-intel text-gray-600">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-intel text-gray-600">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-intel text-gray-600">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-between space-x-6">
                    <button
                        type="submit"
                        className="w-full py-2 font-intel text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="w-full py-2 font-intel text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    const renderOrders = () => (
        <div className="w-full space-y-4">
            <div className='bg-[#FFFFFF]'>
                <h1 className="text-2xl font-bold font-akshar text-gray-700 text-center py-4">
                    My Orders
                </h1>
            </div>
            <p className="text-lg text-gray-600 text-center">Displaying {orders.length} of {orders.length} orders</p>
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
        </div>
    );

    return (
        <div className="p-6">
            {activeSection === 1 && renderPersonalInfo()}
            {activeSection === 2 && renderOrders()}
        </div>
    );
};

export default RightSide;
