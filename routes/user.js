const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /user
// @access Private
router.get("/", (req, res) => {
  res.send("user dashboard");
});
// @desc Register page
// @route POST /user/register
// @access Public
router.post("/register", (req, res) => {
  res.send("Register page");
});

// @desc Login page
// @route GET /user/login
// @access Public
router.get("/login", (req, res) => {
  res.send("Login page");
});

// @desc Login page
// @route POST /user/login
// @access Public
router.get("/logout", (req, res) => {
    res.send("User Logged Out");
});

module.exports = router;