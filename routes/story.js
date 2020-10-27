const express = require("express");
const router = express.Router();
const Story = require('../models/Story');
const passport = require("passport");

// @desc Story summary
// @route GET /story/:storyId
// @access Public
router.get("/:storyId", async (req, res) => {
    const { storyId } = req.params;
    console.log(storyId)
    try {
        const stories = await Story.findOne({ _id: storyId }, (err, story)=>{
            if(!story) res.status(404).send({message: "Invalid story Id"})
            return story
        }).lean();

        res.send({storyData: stories, message: "Story Found"})
    } catch (err) {
        res.status(500).send({message: "Internal Server Error"})
    }
});

// @desc Story Vote update
// @route PUT /story/:storyId/vote
// @access Private
router.put("/:storyId/vote",
passport.authenticate("jwt", {session: false}), async (req, res) => {
    const { storyId } = req.params;

    try {
        await Story.findOne({ _id: storyId }, async (err, story) => {
            if (!story) res.status(404).send({message: "Invalid Story ID"})
            await Story.updateOne({ _id: storyId}, {$set: {voteCount: story.voteCount + 1}})
            res.status(200).send({message: "Vote Updated"})
        });
    } catch (err) {
        res.status(500).send({message: "Internal Server Error"})
    }
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

// @desc Delete comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment/:commentId
// @access Private
router.delete("/:storyId/chapter/:chapterId/comment/:commentId", (req, res) => {
    res.send("delete the comment data in chapter model of the story");
});

module.exports = router;
