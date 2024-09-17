import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation

const ResetPasswordPopup = ({ token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reset-password', { token, newPassword });
      setMessage('Your password has been reset successfully');
    } catch (err) {
      console.error(err);
      setMessage('Failed to reset password');
    }
  };

  const handleClose = () => {
    navigate('/login'); // Navigate to login when close is clicked
  };

  return (
    <div className="fixed inset-x-0 top-0 flex items-start justify-center z-50">
      {/* Overlay with background blur */}
      <div className="absolute inset-0 bg-opacity-100 backdrop-blur-sm"></div>

      {/* Popup Box */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm z-10 mt-6">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Reset Your Password</h2>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Reset Password
            </button>
          </div>
        </form>

        {/* Message */}
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPopup;
