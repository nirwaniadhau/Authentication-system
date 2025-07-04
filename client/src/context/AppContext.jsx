import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/isAuth', {
  withCredentials: true
});

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false); // not authenticated
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/data');
      data.success
        ? setUserData(data.userData)
        : toast.error(data.message || "Failed to fetch user data");
    } catch (err) {
      console.error("Error fetching user data:", err);
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

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
