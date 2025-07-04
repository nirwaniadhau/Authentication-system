import express from "express"
import { registerUser,loginUser, logout, sendVerificationOTP, verifyUser, isAuthenticated, sendResetOTP, resetPassword } from "../Controller/user.controller.js";
import { getUserDetails } from "../Controller/userDetails.js";
import { userAuth } from "../middleware/user.middleware.js";
const userRoute= express.Router();

userRoute.post("/register",registerUser);
userRoute.post("/loginUser",loginUser);
userRoute.post("/logout",logout);
userRoute.post("/send-verify-otp",userAuth,sendVerificationOTP);
userRoute.post("/verifyAccount",userAuth,verifyUser);
userRoute.get("/isAuth",userAuth,isAuthenticated);
userRoute.post("/sendResetOtp",sendResetOTP);
userRoute.post("/resetPass",resetPassword);
userRoute.get("/data",userAuth,getUserDetails)


export default userRoute;