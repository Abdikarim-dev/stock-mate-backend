const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const Users = require("../models/User");
const router = express.Router();

router.post("/login", async (request, response) => {
  try {
    const { identifier, password } = request.body;

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { phone: identifier }],
      },
    });

    if (!existingUser)
      return response.status(404).json({
        success: false,
        message: "Username or Phone Doesn't Exist",
      });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return response.status(404).json({
        success: false,
        message: "Password incorrect, please try again!",
      });

    // payload-> identifier,roles
    // expirationTime ->
    // SIGNATURE ->

    // sidee loo access gareeyaa variable lagu declare gareeyay dotenv (process.env.variable-name)
    const tokenPayload = { id: existingUser.id, role: existingUser.role };
    const expirationTime = 3 * 24 * 60 * 60; // 3 days in seconds

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });

    response.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: expirationTime * 1000, // time in milliseconds
    });

    existingUser.password = undefined

    response.status(200).json({
      success: true,
      message: "User Logged in successfully",
      activeUser: existingUser,
      token,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "Error happened at creating login user",
      error: error.message,
    });
  }
});

module.exports = router;
