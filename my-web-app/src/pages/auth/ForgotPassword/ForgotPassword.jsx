import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword, sendResetCode } from '../../../aws/cognitoService.js';
import './forgotPassword.scss';

const ForgotPassword = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAnnounceEmailModalOpen, setIsAnnounceEmailModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isResetFormVisible, setIsResetFormVisible] = useState(false); 
  const navigate = useNavigate();

  // Password validation function
  const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle sending reset code
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username) {
      setErrorMessage("Please enter your username.");
      return;
    }

    try {
      setIsButtonDisabled(true);
      await sendResetCode(username);
      setMessage("We’ve sent a password reset code to your email. Please check your inbox.");
      setIsAnnounceEmailModalOpen(true);
      setIsResetFormVisible(true); // Show the reset form after sending the code
    } catch (err) {
      console.error('Error sending reset code:', err);
      setErrorMessage(err.message || 'Error sending reset code.');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle confirming the new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetCode || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Validate the new password
    if (!isValidPassword(newPassword)) {
      setErrorMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    try {
      setIsButtonDisabled(true);
      await resetPassword(username, resetCode, newPassword);
      setMessage("Your password has been successfully reset!");

      // Show success message and redirect to login page after a delay
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000);

    } catch (err) {
      console.error('Error resetting password:', err);
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const closeModal = () => {
    setIsAnnounceEmailModalOpen(false);
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <main className="bg-[#F9F1E7] w-full min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-[#337BEE] text-3xl font-akshar text-center mb-6">Forgot password?</h1>

        {/* Step 1: Enter Username */}
        {!isResetFormVisible && (
          <form onSubmit={handleSendResetCode}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-intel text-[#333]">Enter the username you used to register with.</label>
              <input
                type="text"
                id="username"
                className ="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
        )}

        {/* Step 2: Handle Reset Code and New Password */}
        {isResetFormVisible && (
          <form onSubmit={handleResetPassword}>
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

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-intel text-[#333]">Confirm your new password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
        )}
      </div>

      {/* Modal for successful password reset code sending */}
      {isAnnounceEmailModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-90 text-center">
            <div className='flex items-end justify-end' onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='h-6 w-6 cursor-pointer'>
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24. 6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
              </svg>
            </div>
            <h2 className="text-xl font-intel text-[#337BEE] mb-4">Check your inbox</h2>
            <p className="text-sm text-[#333] font-intel mb-4">{message}</p>
            <button onClick={closeModal} className="mt-4 py-2 px-4 bg-[#337BEE] text-white rounded-lg hover:bg-[#4484ea] transition-colors">
              Proceed to Reset Password
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ForgotPassword;