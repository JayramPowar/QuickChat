import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloud.js";


//* ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { email, fullName, password, bio } = req.body;

    if (!email || !fullName || !password) {
      return res.json({
        success: false,
        message: "Missing required details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Account already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


//* ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({
        success: false,
        message: "Account does not exist.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData, // ✅ FIXED (NO newUser here)
      token,
      message: "Login successful.",
    });
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};


//* ================= CHECK AUTH =================
export const checkAuth = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
    message: "User is authenticated.",
  });
};


//* ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    

    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    return res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};
