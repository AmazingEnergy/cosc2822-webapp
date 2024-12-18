import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from "../../../aws/cognitoService.js";
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const result = await login(username, password);
            setSuccess("You have logged in successfully!");

            // Example logic to redirect based on roles
            const userRole = result?.role; // Update based on actual login response
            const redirectPath = userRole === "admin" ? "/admin-dashboard" : "/homepage";

            setTimeout(() => {
                navigate(redirectPath);
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-intel text-[#333]">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="text-red-500 mt-3">{error}</p>}
                    {success && <p className="text-green-500 mt-3">{success}</p>}
                </form>
            </div>
        </main>
    );
};

export default Login;
