// This file defines the API endpoints for user authentication: signup, login, and logout. It handles user registration, credential validation, and session management using JWT tokens stored in cookies.

const express = require("express");
const { validateData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateData(req);
    const {
      password,
      firstName,
      lastName,
      emailId,
      photoURL,
      about,
      gender,
      age,
      skills,
      photos,
      isVerified,
    } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPass,
      photoURL,
      about,
      gender,
      skills,
      photos,
      isVerified,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // ✅ Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid credentials");

    const isPassVal = await user.validatePassword(password);
    if (!isPassVal) throw new Error("Email/Password is not correct");

    const token = await user.getJWT();

    // ✅ Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send(user);
  } catch (err) {
    res.status(400).send("Invalid Credentials!!");
  }
});


authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout succesfull");
});

module.exports = authRouter;
