import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login, respondToMfaChallenge } from "../../../aws/cognitoService.js";
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [isMfaRequired, setIsMfaRequired] = useState(false);
    const [session, setSession] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await login(username, password);
            setSuccess("You have login successful!");

            setTimeout(() => {
                navigate('/homepage');
            }, 5000);

        } catch (err) {
            if (err.mfaRequired) {
                setIsMfaRequired(true);
                setSession(err.session); // Store the session for MFA
            } else {
                setError(err.message);
            }
        }
    };

    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await respondToMfaChallenge(username, mfaCode, session);
            setSuccess("MFA verification successful! Access token: " + result.AccessToken);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>
                {!isMfaRequired ? (
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
                        >
                            Login
                        </button>

                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3">{success}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleMfaSubmit}>
                        <div className="mb-4">
                            <label htmlFor="mfaCode" className="block text-sm font-intel text-[#333]">MFA Code</label>
                            <input
                                type="text"
                                id="mfaCode"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="Enter MFA code"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                        >
                            Verify MFA
                        </button>
                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3">{success}</p>}
                    </form>
                )}
            </div>
        </main>
    );
};

export default Login;