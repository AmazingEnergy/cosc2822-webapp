import React, { useState } from 'react';
import './login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-intel text-[#333]">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" className="block text-sm font-intel text-[#333]">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right mb-3">
                        <a href="/forgot-password" className="text-sm text-[#337BEE] hover:text-[#337BEE] hover:underline">Forgot your password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;
