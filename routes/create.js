const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /create
// @access Private
router.get("/", (req, res) => {
  res.send("it should create");
});

module.exports = router;
