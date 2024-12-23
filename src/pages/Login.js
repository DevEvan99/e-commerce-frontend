import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      navigate(`/`);
    } catch (err) {
      setError(err.message );
    }
  };

  return (
    <div className="flex flex-col justify-center container mx-auto max-w-md p-6 rounded-lg h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Login</h1>
      {error && (
        <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </div>
      </form>
      {/* Register Link */}
      <p className="text-sm text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a
          href="/Register"
          className="text-blue-600 font-medium hover:underline"
        >
          Register here
        </a>
      </p>
    </div>
  );
  
};

export default Login;
