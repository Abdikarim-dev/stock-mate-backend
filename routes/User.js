const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const { Op } = require("sequelize");

const router = express.Router();

router.post("/create", async (request, response) => {
  try {
    const { fullname, username, phone, email, role, password } = request.body;

    if (!fullname || !username || !phone || !email || !password)
      return response.status(404).json({
        message: "All Fields are required!",
        success: false
      });

    // checking availability of username, phone and email
    const checkForUserOrPhoneOrEmail = await Users.findOne({
      where: {
        [Op.or]: [{ username }, { phone }, { email }],
      },
    });

    if (
      checkForUserOrPhoneOrEmail &&
      checkForUserOrPhoneOrEmail.username === username
    )
      return response.status(404).json({ success: false, message: "Username Already exists" });
    if (
      checkForUserOrPhoneOrEmail &&
      checkForUserOrPhoneOrEmail.phone === phone
    )
      return response.status(404).json({ success: false, message: "Phone Already exists" });
    if (
      checkForUserOrPhoneOrEmail &&
      checkForUserOrPhoneOrEmail.email === email
    )
      return response.status(404).json({ success: false, message: "Email Already exists" });

    //   Hashing the password (bcrypt)

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      fullname,
      username,
      phone,
      email,
      role,
      password: hashedPassword,
    });

    response.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "Error happened at creating new user",
      error: { error },
      errorMessage: error.message,
    });
  }
});

router.get("/read", async (_, response) => {
  try {
    const users = await Users.findAll()


    response.status(200).json({
      success: true,
      message: "all the users ",
      users
    })

  } catch (error) {
    response.status(400).json({
      success: false,
      message: "error in the delete user",
      error: error.message
    })
  }
})
router.get("/read/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const user = await Users.findByPk(id);

  response.status(200).json({
    message: "a user has been selected",
    data: user,
  });
});
router.patch("/update/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id)
    console.log("update", id);

    const { fullname, username, phone, email, role } = request.body;

    const user = await Users.findByPk(id)

    if (!user) return response.status(404).json({ success: false, message: "User not found " })

    const updatedUser = await Users.update({
      fullname: fullname,
      username: username,
      phone: phone,
      email: email,
      role: role,
    },
      {
        where: { id }
      }
    );
    response.status(200).json({
      success: true,
      message: "a user has been updated successfully ",
      data: updatedUser,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "error in the update user",
      error: error.message,
    });
  }
});
router.delete("/delete/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id)

    const user = await Users.findByPk(id)

    if (!user) return response.status(404).json({success: false, message: "user not found" })

    const deletedUser = await Users.destroy({ where: { id } })

    response.status(200).json({
      success: true,
      message: "a user has been deleted",
      data: deletedUser
    })

  } catch (error) {
    response.status(400).json({
      success: false,
      message: "error in the delete user",
      error: error.message
    })

  }
})


module.exports = router;
