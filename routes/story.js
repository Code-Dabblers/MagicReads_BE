const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /story
// @access Public
router.get("/", (req, res) => {
  res.json({ hey: "it's a story" });
});
