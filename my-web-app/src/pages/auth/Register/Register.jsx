import React, { useState } from 'react';
import './register.scss';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for empty fields before proceeding
        if (!firstName || !lastName || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Check if email is confirmed before proceeding
        if (!isEmailConfirmed) {
            setIsModalOpen(true);
            return;
        }

        // Proceed with the registration logic (e.g., API call to create account)
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Email:', email);
        console.log('Password:', password);

        // Reset form after submission
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const handleConfirmEmail = () => {
        setIsEmailConfirmed(true);
        setIsModalOpen(false);
        setIsButtonDisabled(true); // Disable button until the confirmation process is done
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsButtonDisabled(false); // Enable the button if the user decides to cancel the confirmation
    };

    return (
        <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-[#D07373] text-3xl font-akshar text-center mb-6">EASYSTORE</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-row space-x-4">
                        <div className="mb-4 flex-1">
                            <label htmlFor="firstName" className="block text-sm font-intel text-[#333]">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4 flex-1">
                            <label htmlFor="lastName" className="block text-sm font-intel text-[#333]">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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

                    <div className="mb-6">
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
                        disabled={isButtonDisabled}
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

            {/* Modal for Email Confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[780px] text-center">
                        <div className='flex items-end justify-end' onClick={handleCloseModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='h-6 w-6'>
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                            </svg>
                        </div>
                        <img src="./assets/email.png" className="h-[177px] w-[212px] mx-auto mb-4" alt="Email Confirmation" />
                        <h2 className="text-xl font-akshar font-bold text-[#353535] text-[30px] pt-3 mb-4">Email Confirmation</h2>
                        <div className="flex w-full justify-center">
                            <p className="w-[450px] text-sm font-intel text-[#7B7B7B] mb-4">
                                We have sent an email to <strong className="text-[#008080]">{email}</strong> to confirm the validity of your email address. After receiving the email, follow the link provided to complete your registration.
                            </p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex flex-row space-x-2 items-center justify-center">
                            <p className="text-sm font-intel text-[#7B7B7B]">If you haven't received the email</p>
                            <p className="text-sm font-intel text-[#5295E5] cursor-pointer" onClick={handleConfirmEmail}>Resend confirmation email</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Register;