// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { auth } = require("../middlewares/auth");
const router = express.Router();

function signToken(user) {
  // put id (and a couple safe fields) in the payload
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email, and password are required",
      });
    }

    // password gets hashed by the model hook
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    const token = signToken(user); // <-- FIX: pass the user, not user.id
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.status(201).json({
      success: true,
      status: 201,
      message: "User registered successfully",
      user: safeUser,
      token,
    });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists" });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });

    // include password hash via scope
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user || !(await user.verifyPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user); // <-- FIX: pass the user, not user.id
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.json({
      success: true,
      status: 200,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/auth/profile (protected)
router.get("/profile", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  return res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

module.exports = router;
