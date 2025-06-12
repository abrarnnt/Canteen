// src/components/Auth/Register.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    sendOtpTo: "email",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
        localStorage.setItem("pendingEmail", form.email);
        navigate("/verify-otp");
      // Optionally auto-login after registration (only if backend returns token)
      if (res.data.token) {
        login(res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login"); // or show success and redirect
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.msg || error.message);
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
         <div className="flex space-x-4">
         <p>Send OTP</p>
         <label>
           <input
             type="radio"
             name="sendOtpTo"
             value="email"
             checked={form.sendOtpTo === "email"}
             onChange={(e) => setForm({ ...form, sendOtpTo: e.target.value })}
           />
           Email
         </label>
         <label>
           <input
             type="radio"
             name="sendOtpTo"
             value="phone"
             checked={form.sendOtpTo === "phone"}
             onChange={(e) => setForm({ ...form, sendOtpTo: e.target.value })}
           />
           Phone
         </label>
       </div>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
