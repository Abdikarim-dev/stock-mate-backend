const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const { authenticate } = require("../middleware/authMiddleware");

const Users = require("../models/User");
const router = express.Router();

router.post("/login", async (request, response) => {
  try {
    const { identifier, password } = request.body;

    if (!identifier || !password) {
      return response.status(400).json({
        success: false,
        message: "Identifier and password are required",
      });
    }

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { phone: identifier }],
      },
    });

    if (!existingUser) {
      return response.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return response.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const tokenPayload = {
      id: existingUser.id,
      role: existingUser.role,
    };

    const expirationTime = 3 * 24 * 60 * 60; // 3 days (seconds)

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });

    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: expirationTime * 1000,
    });

    // Explicitly shape the user object
    const user = {
      id: existingUser.id,
      username: existingUser.username,
      phone: existingUser.phone,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
    };

    return response.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});
router.get("/me", authenticate, async(req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
  // try {
  //   // At this point, req.user is already verified by the middleware
  //   const user = {
  //     id: req.user.id,
  //     role: req.user.role,
  //   };

  //   return res.status(200).json({
  //     success: true,
  //     user,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "Error fetching user",
  //     error: error.message,
  //   });
  // }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in HTTPS / production
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
