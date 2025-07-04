import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String, default: "" },
  verificationTokenExpiry: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpiry: { type: Number, default: 0 },
});

const User=mongoose.model.user || mongoose.model('user',userSchema);

export default User;