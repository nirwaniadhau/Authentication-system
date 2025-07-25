import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function EmailVerify() {
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
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

  const onSubmitHandler = async (e) => {
  e.preventDefault();
  const otpArray = inputRefs.current.map((input) => input.value);
  const otp = otpArray.join("");

  try {
    const token = localStorage.getItem("token"); // ✅ Get token from localStorage

    const { data } = await axios.post(
      backendUrl + "/api/auth/verifyAccount",
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
        withCredentials: true,
      }
    );

    if (data.success) {
      toast.success(data.message);
      await getUserData(); // refresh user state
      navigate("/");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  // ✅ Only redirect if not logged in or already verified
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6 digit code sent to your email id.</p>

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

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
