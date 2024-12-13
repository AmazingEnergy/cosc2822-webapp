import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import './forgotPassword.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');

    // Step 1: Handle forgot password request (send code)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        try {
            setIsButtonDisabled(true);
            // Trigger forgot password logic from AWS Cognito
            await Auth.forgotPassword(email);
            setIsModalOpen(true);
            setMessage("We’ve sent a password reset code to your email. Please check your inbox.");
            setIsButtonDisabled(false);
        } catch (err) {
            console.error('Error sending reset code:', err);
            setErrorMessage(err.message || 'Error sending reset code');
            setIsButtonDisabled(false);
        }
    };

    // Step 2: Confirm new password after the user enters the code
    const handleConfirmPassword = async (e) => {
        e.preventDefault();
        if (!resetCode || !newPassword) {
            setErrorMessage("Please enter the reset code and new password.");
            return;
        }

        try {
            setIsButtonDisabled(true);
            // Confirm new password logic from AWS Cognito
            await Auth.confirmForgotPassword(email, resetCode, newPassword);
            setIsModalOpen(true);
            setMessage("Your password has been successfully reset!");
            setIsButtonDisabled(false);
        } catch (err) {
            console.error('Error confirming password:', err);
            setErrorMessage(err.message || 'Error confirming new password');
            setIsButtonDisabled(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#337BEE] text-3xl font-akshar text-center mb-6">Forgot password?</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-intel text-[#333]">Enter the email address you used to register with.</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#337BEE] text-white font-intel rounded-lg hover:bg-[#4484ea] transition-colors"
                        disabled={isButtonDisabled}
                    >
                        {isButtonDisabled ? "Sending..." : "Send reset code"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="/login" className="font-intel text-sm text-[#337BEE] hover:text-[#4484ea]">Back to Login</a>
                </div>
            </div>

            {/* Modal for successful password reset code sending */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-90 text-center">
                        <div className='flex items-end justify-end' onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='h-6 w-6'>
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-intel text-[#337BEE] mb-4">Check your inbox</h2>
                        <p className="text-sm text-[#333] font-intel mb-4">{message}</p>
                    </div>
                </div>
            )}

            {/* Step 2: Handle Reset Code and New Password */}
            {isModalOpen && !errorMessage && (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-[#337BEE] text-2xl font-akshar text-center mb-6">Reset your password</h2>

                    <form onSubmit={handleConfirmPassword}>
                        <div className="mb-4">
                            <label htmlFor="resetCode" className="block text-sm font-intel text-[#333]">Enter the reset code sent to your email</label>
                            <input
                                type="text"
                                id="resetCode"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="Reset code"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-intel text-[#333]">Enter your new password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-[#337BEE] text-white font-intel rounded-lg hover:bg-[#4484ea] transition-colors"
                            disabled={isButtonDisabled}
                        >
                            {isButtonDisabled ? "Resetting..." : "Confirm new password"}
                        </button>
                    </form>
                </div>
            )}
        </main>
    );
};

export default ForgotPassword;
