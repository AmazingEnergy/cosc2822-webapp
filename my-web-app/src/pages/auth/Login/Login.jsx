import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

import { login as cognitoLogin, parseIdToken } from "../../../aws/cognitoService.js";

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
            const result = await cognitoLogin(username, password);
            
            if (result && result.user) {
                setSuccess("You have logged in successfully!");
                // Parse the idToken to get user attributes and role
                const userAttributes = parseIdToken(result.idToken);
                const userRole = userAttributes.role;

                // Redirect based on role
                const redirectPath = userRole === "admin" ? "/admin-dashboard" : "/";
                setTimeout(() => {
                    navigate(redirectPath);
                    window.location.reload();
                }, 2000);
            } else {
                console.error("User data is missing in the result.");
                setError("Failed to retrieve user data.");
            }
        } catch (err) {
            console.error("Error during login:", err);
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
                        <a href="/forgot-password" className="text-intel text-sm text-[#337BEE] hover:text-[#337BEE] hover:underline">Forgot your password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <div className="mt-4 text-center flex justify-center items-center">
                        <p className="text-sm font-intel mr-2">Don't have an account yet?</p>
                        <Link to="/register" className="text-sm font-intel text-[#337BEE] hover:underline">Register Now</Link>
                    </div>

                    {error && <p className="text-red-500 mt-3">{error}</p>}
                    {success && <p className="text-green-500 mt-3">{success}</p>}
                </form>
            </div>
        </main>
    );
};

export default Login;
