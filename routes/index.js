const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

// @desc Landing page
// @route GET /
// @access Public
router.post("/", async (req, res) => {
  try {
    await Story.create(req.body);
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/user", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/chapter", async (req, res) => {
  try {
    await Chapter.create(req.body);
    res.send("it works for chapter");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;