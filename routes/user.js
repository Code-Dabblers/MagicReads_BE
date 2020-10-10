const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /user
// @access Private
router.get("/", (req, res) => {
  res.send("it should work");
});

// @desc Register page
// @route GET /user/register
// @access Public
router.get("/register", (req, res) => {
  res.send("Register page");
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
router.get("/login", (req, res) => {
  res.send("Login page");
});

// @desc Login page
// @route POST /user/login
// @access Public
router.get("/login", (req, res) => {
  res.send("Login page");
});

module.exports = router;
