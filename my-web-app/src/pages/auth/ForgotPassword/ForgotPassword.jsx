import React, { useState } from 'react';
import './forgotPassword.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Disable the button to prevent multiple submissions
        setIsButtonDisabled(true);

        // Simulate the email sending logic (you would integrate with a backend service here)
        setTimeout(() => {
            setIsModalOpen(true);
            setIsButtonDisabled(false);
            setEmail('');
        }, 1500);
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
                        {isButtonDisabled ? "Sending..." : "Reset password"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="/login" className="font-intel text-sm text-[#337BEE] hover:text-[#4484ea]">Back to Login</a>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-90 text-center">
                        <h2 className="text-xl font-intel text-[#337BEE] mb-4">Check your inbox</h2>
                        <p className="text-sm text-[#333] mb-4">We’ve sent a password reset to your email address. <br/> Please check your inbox.</p>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-[#337BEE] text-white rounded-lg hover:bg-[#4484ea] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ForgotPassword;
