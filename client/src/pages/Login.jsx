// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logo, background } from "../Assets/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateInputs = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    return true;
  };

  const loginUser = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.token); // Use context to set authentication
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <div className="text-center">
        <img
          className="w-80 h-70 mb-auto sm:mb-20 mx-auto min-w-[150px]"
          src={logo}
          alt="logo"
        />
        <form onSubmit={loginUser} className="mx-auto mt-4 text-left">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-600 text-left">
              Login
            </h1>
            <p className="text-gray-500 text-left">
              Need an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-lime-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Add Forgot Password Button */}
          <div className="mt-4 text-left">
            <button
              type="button"
              className="text-lime-500 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
