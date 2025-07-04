import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function RestPassword() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    const pasteArray = pastedData.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/sendResetOtp", { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
        localStorage.setItem("reset-email", email); // store email
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while sending the email.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    const otp = otpArray.join("");
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    localStorage.setItem("reset-otp", otp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem("reset-email");
    const storedOtp = localStorage.getItem("reset-otp");

    if (!storedEmail || !storedOtp || !newPassword) {
      toast.error("Email, OTP and new password are required");
      return;
    }

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/resetPass", {
        email: storedEmail,
        otp: storedOtp,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("reset-email");
        localStorage.removeItem("reset-otp");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while resetting the password.");
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Step 1: Email Input */}
      {!isEmailSent && (
        <form onSubmit={handleEmailSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 bg-[#1f2937] rounded-md">
            <img src={assets.mail_icon} alt="mail" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/* Step 2: OTP Input */}
      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={handleOtpSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>

          <div onPaste={handlePaste} className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* Step 3: New Password Input */}
      {isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 bg-[#1f2937] rounded-md">
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default RestPassword;
