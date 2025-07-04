import User from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Use this if using JWT auth middleware

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        isAccountVerified: user.isVerified
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
