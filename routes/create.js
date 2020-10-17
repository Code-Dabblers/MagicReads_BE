const express = require("express");
const router = express.Router();

// @desc Create story page
// @route POST /create
// @access Private
router.post("/", (req, res) => {
  res.send("it should take book details"); // this should return back a storyID which will be used to create the chapter 
});

// @desc Publish a chapter
// @route POST /create/story/:storyId
// @access Private
router.post("/:storyId/chapter/:chapterId", (req, res) => {
  res.send("Create a chapter and push it into Chapter data collection");
});

module.exports = router;
