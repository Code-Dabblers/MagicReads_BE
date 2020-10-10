const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /search
// @access Private
router.get("/", (req, res) => {
  res.send("it should work tooo");
});

module.exports = router;
