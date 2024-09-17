import { useState } from 'react';
import axios from 'axios';
import ResetPasswordPopup from './ResetPasswordPopup';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [showResetPopup, setShowResetPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setToken(data.token);
      setShowResetPopup(true); // Show the reset password popup
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`relative h-screen flex justify-center items-center ${showResetPopup}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">Forgot Password</h1>
        <p className="text-center text-gray-500 mb-6">Enter your email address to receive a password reset Popup.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>

      {showResetPopup && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm">
          <ResetPasswordPopup token={token} />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
