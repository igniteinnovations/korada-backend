import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

// REGISTER ADMIN
export const registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required",
      });
    }

    // Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,

        message: "Admin already exists",
      });
    }

    // Create admin
    const admin = await Admin.create({
      email,
      password,
    });

    res.status(201).json({
      success: true,

      message: "Admin registered successfully",

      admin,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    // Password check
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      admin: {
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    // Check confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,

        message: "Passwords do not match",
      });
    }

    // Find admin
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,

        message: "Admin not found",
      });
    }

    // Verify current password
    if (admin.password !== currentPassword) {
      return res.status(401).json({
        success: false,

        message: "Current password is incorrect",
      });
    }

    // Update password
    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      success: true,

      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
