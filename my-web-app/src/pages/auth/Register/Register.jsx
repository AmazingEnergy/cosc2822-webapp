import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import './register.scss';

// Reusable InputField component
const InputField = ({ id, label, type = 'text', placeholder, value, onChange }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-intel text-[#333]">{label}</label>
        <input
            type={type}
            id={id}
            className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        />
    </div>
);

// Modal component for email confirmation
const Modal = ({ email, onClose, onConfirm, message, error }) => (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[780px] text-center">
            <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
                &times;
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Email Confirmation</h2>
            {error && <p className="text-red-500">{error}</p>}
            <p>{message}</p>
            <p>Check your email ({email}) for a confirmation code.</p>
            <button
                className="mt-4 bg-[#D07373] text-white py-2 px-4 rounded"
                onClick={onConfirm}
            >
                Confirm Email
            </button>
        </div>
    </div>
);

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [message, setMessage] = useState("");

    // Handle user registration
    const handleRegister = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const fullName = `${firstName} ${lastName}`;
            await Auth.signUp({
                username: email,
                password,
                attributes: {
                    email,
                    name: fullName,
                },
            });
            setIsModalOpen(true);
            setMessage('A confirmation code has been sent to your email.');
        } catch (err) {
            console.error('Error signing up:', err);
            setError(err.message || 'Registration failed');
        }
    };

    // Handle email confirmation with the code
    const handleConfirmEmail = async () => {
        try {
            await Auth.confirmSignUp(email, confirmationCode);
            setIsModalOpen(false);
            setMessage('Email confirmed! You can now log in.');
        } catch (err) {
            console.error('Error confirming email:', err);
            setError(err.message || 'Confirmation failed');
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>

                <form onSubmit={handleRegister}>
                    <div className="flex flex-row space-x-4">
                        <InputField
                            id="firstName"
                            label="First Name"
                            placeholder="First name"
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <InputField
                            id="lastName"
                            label="Last Name"
                            placeholder="Last name"
                            value={lastName}
                            onChange={setLastName}
                        />
                    </div>

                    <InputField
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={setEmail}
                    />

                    <InputField
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={setPassword}
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#D07373] text-white font-intel rounded-lg hover:bg-[#E89F71] transition-colors"
                        disabled={isButtonDisabled || !firstName || !lastName || !email || !password}
                    >
                        {isButtonDisabled ? 'Confirming Email...' : 'Create new account'}
                    </button>

                    <div className="items-center justify-center mt-4 flex space-x-2">
                        <span className="text-sm text-[#829AB1] hover:text-[#E89F71]">
                            Already have an account?
                        </span>
                        <a href="/login" className="font-intel font-bold underline text-[13px] text-[#D07373]">
                            Login Now
                        </a>
                    </div>
                </form>
            </div>

            {/* Email Confirmation Modal */}
            {isModalOpen && (
                <Modal
                    email={email}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmEmail}
                    message={message}
                    error={error}
                />
            )}
        </main>
    );
};

export default Register;
