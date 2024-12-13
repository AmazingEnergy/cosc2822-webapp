import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";
import { register, confirmSignUp } from '../../../aws/cognitoService.js';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation function
    const isValidPassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
        return passwordRegex.test(password);
    };

    // Validate Email
    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    // Validate Password
    const validatePassword = () => {
        if (!isValidPassword(password)) {
            setError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return false;
        }
        return true;
    };

    // Check username and email existence logic
    const checkUsernameAndEmail = async () => {
        // Uncomment and implement if necessary
        // const usernameExists = await checkUsernameExists(username);
        // if (usernameExists) {
        //     setError("Username is already taken.");
        //     return false;
        // }

        // const emailExists = await checkEmailExists(email);
        // if (emailExists) {
        //     setError("Email already exists.");
        //     return false;
        // }

        return true;
    };

    // Register user
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateEmail() || !validatePassword()) return;

        // Check if username or email exists
        if (!(await checkUsernameAndEmail())) return;

        try {
            await register(username, password, email); // Registering user
            setIsConfirming(true);
            setSuccess(`Registration successful! Please check your ${email} for the confirmation code.`);
        } catch (err) {
            setError(err.message);
        }
    };

    // Confirm user registration
    const handleConfirm = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await confirmSignUp(username, confirmationCode);
            setSuccess("Confirmation successful! You can now log in.");
            setIsConfirming(false);

            // Delay 5 seconds before navigating to login
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>
                {!isConfirming ? (
                    <form onSubmit={handleRegister}>
                        <div className="flex flex-row space-x-4">
                            <div className="mb-4 w-full">
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
                        </div>
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
                        <div className="mb-4">
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
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                        >
                            Create new account
                        </button>
                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3" dangerouslySetInnerHTML={{ __html: success }} />}
                    </form>
                ) : (
                    <form onSubmit={handleConfirm}>
                        <div className="mb-4">
                            <img src="./assets/email.png" className="h-[177px] w-[212px] mx-auto mb-4" alt="Email Confirmation" />
                            <h2 className="text-xl font-akshar font-bold text-[#353535] text-[30px] pt-3 mb-4">Email Confirmation</h2>

                            <label htmlFor="confirmationCode" className="block text-sm font-intel text-[#333]">Confirmation Code</label>
                            <input
                                type="text"
                                id="confirmationCode"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="Enter confirmation code"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                        >
                            Confirm Registration
                        </button>
                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3">{success}</p>}
                    </form>
                )}
            </div>
        </main>
    );
};

export default Register;
