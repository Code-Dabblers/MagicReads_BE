const express = require("express");
const router = express.Router();

// @desc Landing page
// @route GET /storyname
// @access Public
router.get("/", (req, res) => {
  res.json({hey: "it works stories"});
});

// @desc Landing page
// @route GET /storyname/chapter1
// @access Public
router.get("/chapter:id", (req, res) => {
    res.send("Chapter wise");
  });

// @desc Landing page
// @route POST /storyname/chapter1/comment
// @access Public
router.post("/chapter:id/comment", (req, res) => {
    res.send("Comments chapter wise");
  });

// @desc Landing page
// @route POST /storyname/vote
// @access Public
router.post("/vote", (req,res) => {
    res.send("Increase the votes");
})

module.exports = router;
