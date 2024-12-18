import React, { useState } from 'react';
import { resetPassword } from '../../../aws/cognitoService.js'; // Ensure these imports are correct
import './forgotPassword.scss';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  // Password validation function
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle sending reset code
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      setIsButtonDisabled(true);
      await resetPassword(username); // Call the resetPassword function
      setIsModalOpen(true);
      setMessage("We’ve sent a password reset code to your email. Please check your inbox.");
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

  if (!resetCode || !newPassword) {
    setErrorMessage("Please enter the reset code and new password.");
    return;
  }

  if (!isValidPassword(newPassword)) {
    setErrorMessage(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }

  try {
    setIsButtonDisabled(true);
    const successMessage = await resetPassword(username, resetCode, newPassword); 
    setIsResetComplete(true);
    setMessage(successMessage);
  } catch (err) {
    console.error('Error resetting password:', err);
    setErrorMessage(err.message || 'Failed to reset password.');
  } finally {
    setIsButtonDisabled(false);
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setIsResetComplete(false);
  };

  return (
    <main className="bg-[# F9F1E7] w-full min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-[#337BEE] text-3xl font-akshar text-center mb-6">Forgot Password?</h1>

        {!isModalOpen && (
          <form onSubmit={handleSendResetCode}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-intel text-[#333]">
                Enter the username you used to register with.
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                placeholder="Enter your username"
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
              {isButtonDisabled ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {isModalOpen && !isResetComplete && (
          <div className="mt-4">
            <h2 className="text-[#337BEE] text-2xl font-akshar text-center mb-6">Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="resetCode" className="block text-sm font-intel text-[#333]">Reset Code</label>
                <input
                  type="text"
                  id="resetCode"
                  className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                  placeholder="Reset Code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-intel text-[#333]">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 bg-white border border-[rgba(23,78,130,0.15)] rounded-[8px] mt-2"
                  placeholder="New Password"
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
                {isButtonDisabled ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        )}

        {isResetComplete && (
          <div className="mt-4">
            <p className="text-green-500 text-sm text-center">{message}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 mt-4 bg-[#337BEE] text-white font-intel rounded-lg hover:bg-[#4484ea] transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword