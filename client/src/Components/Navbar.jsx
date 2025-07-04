import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl, getUserData } =
    useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");

      if (data.success) {
        toast.success(data.message);

        // ✅ Update user data before navigating
        await getUserData();

        // ✅ Navigate after updating context
        navigate("/email-verify");
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout error");
    }
  };

  return (
    <div className="w-full flex justify-between items-center py-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {userData ? (
        <div className="relative">
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white text-lg font-semibold cursor-pointer"
          >
            {userData.name[0].toUpperCase()}
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-10 z-10 text-black bg-white rounded shadow-lg">
              <ul className="list-none m-0 p-2 rounded-lg text-sm whitespace-nowrap">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOTP}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
