// src/components/Auth/Login.jsx
import React, { useState, useContext } from "react";
import axios from "../../utils/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" }); // identifier = email or phone
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      const res = await axios.post("/auth/login", form);
      if (res.data.token) {
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.msg || error.message);
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Login</h2>

        <input
          type="text"
          placeholder="Email or Phone"
          className="w-full p-2 border"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline ml-1"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
