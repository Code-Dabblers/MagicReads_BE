const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /edit
// @access Private
router.get("/", (req, res) => {
  res.send("it edit time");
});

module.exports = router;
