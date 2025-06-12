// src/components/Auth/VerifyOtp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      alert("Email not found. Please register again.");
      navigate("/register");
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        emailOrPhone: email,
        otp,
      });
      alert(res.data.msg);
      localStorage.removeItem("pendingEmail");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-semibold">Enter OTP</h2>
        <input
          type="text"
          placeholder="OTP"
          className="w-full p-2 border"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
