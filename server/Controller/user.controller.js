import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({
      message: "Please fill in all fields",
      success: false,
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie (optional)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    // Send welcome email (optional, non-blocking)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Company 🎉",
      text: `Hi ${name},\n\nWelcome to our company! We're glad to have you onboard.\n\nBest regards,\nTeam`,
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for signing up with us. We’re excited to have you on board!</p>
        <p>Feel free to reply to this email if you have any questions.</p>
        <br>
        <p>— The Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully");
    } catch (emailError) {
      console.error("❌ Email failed:", emailError.message);
    }

    // ✅ Return token in response body
    return res.status(201).json({
      message: "Registered successfully",
      success: true,
      token, // 🔑 Add this
    });

  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    return res.status(500).json({
      message: "Registration failed",
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill in all fields", success: false });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Logged in successfully",
      success: true,
      token, // ✅ Fix: Include token here
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to login", success: false });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      message: "Logged out",
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to logout", success: false });
  }
};

export const sendVerificationOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verificationToken = otp;
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Verification OTP sent to email",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
};

export const verifyUser = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verificationToken !== otp) {
      return res.json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      return res.json({
        message: "OTP expired",
        success: false,
      });
    }

    user.isVerified = true;
    user.verificationToken = "";
    user.verificationTokenExpiry = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Failed email verification",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 24 * 15 * 60 * 1000; // 15 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}.Use this otp to reset your password.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "To reset the password,OTP sent to email",
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword= async (req, res)=>{
  const {email,otp,newPassword}=req.body;

  if(!email ||!otp ||!newPassword){
    return res.json({
      success: false,
      message: "Email,OTP and new password are required",
  });
}
   try{

    const user=await User.findOne({email});
    if(!user){
      return res.json({
        message:" user not found",
        success:false
      });
    }

    if(user.resetOtp==="" || user.resetOtp!==otp){
      return res.json({
        message: "Invalid OTP",
        success:false,
      });
    }

    if(user.resetOtpExpiry < Date.now()){
      return res.json({
        message: "OTP expired",
        success:false,
      });
    }

    const hashedPass=await bcrypt.hash(newPassword,10);

    user.password=hashedPass;
    user.resetOtp="";
    user.resetOtpExpiry=0;
    user.save();

    return res.json({
      message:"Password has been successfully reset",
      success:true
    })

   }catch(error){
    return res.json({
      success:false,
      message:error.message
    });

   }
};

