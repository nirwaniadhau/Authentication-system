import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Get Auth State on Initial Load
  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }

      const { data } = await axios.get(backendUrl + "/api/auth/isAuth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData(); // fetch user data after auth confirmed
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // ✅ Securely Fetch User Data
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }

      const { data } = await axios.get(backendUrl + "/api/auth/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
