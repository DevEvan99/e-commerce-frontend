import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = ({ setToken }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully registered!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4",
        },
        buttonsStyling: false,
      }).then (() => {
        navigate(`/`);
      })
    } catch (err) {
      setError(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="flex flex-col justify-center container mx-auto max-w-md p-6 rounded-lg h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Register</h1>
      {error && (
        <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default Register;
