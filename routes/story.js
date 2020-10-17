const express = require("express");
const router = express.Router();

// @desc Story summary
// @route GET /story/:storyId
// @access Public
router.get("/:storyId", (req, res) => {
  res.send("fetch story details with that params.storyId");
});

// @desc Story Vote update
// @route PUT /story/:storyId/vote
// @access Private
router.put("/:storyId/vote", (req, res) => {
  res.send("increase the story vote counter");
});

// @desc Chapter of the Story
// @route GET /story/:storyId/chapter/:chapterId
// @access Public
router.get("/:storyId/chapter/:chapterId", (req, res) => {
  res.send("fetch story details with that id");
});

// @desc Add comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment
// @access Private
router.put("/:storyId/chapter/:chapterId/comment", (req, res) => {
  res.send("update the comment data in chapter model of the story");
});

module.exports = router;
