const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

// @desc Story summary
// @route GET /story/:storyId
// @access Public
router.get("/:storyId", (req, res) => {
    // res.send("fetch story details with that params.storyId");
    try {
        Story.findOne({ _id: req.params.storyId }, (err, story) => {
            if (!story) throw "Invalid Story ID";
            console.log("Story details have been fetched");
            res.send(story);
        }).lean();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// @desc Story Vote update
// @route PUT /story/:storyId/vote
// @access Private
router.put("/:storyId/vote", (req, res) => {
    // res.send("increase the story vote counter");
    try {
        Story.findByIdAndUpdate(
            req.params.storyId,
            { $inc: { voteCount: 1 } },
            (err, result) => {
                if (!result) throw "Story with this ID is not found";
                console.log("Story vote counter has been increased");
                res.send(result);
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// @desc Chapter of the Story
// @route GET /story/:storyId/chapter/:chapterId
// @access Public
router.get("/:storyId/chapter/:chapterId", (req, res) => {
    // res.send("fetch story details with that id");
    const { storyId, chapterId } = req.params;
    try {
        Chapter.findOne({ _id: chapterId, storyId }, (err, chapter) => {
            if (!chapter) throw "Invalid Story or Chapter ID";
            console.log("Chapter details have been fetched");
            res.send(chapter);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// @desc Add comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment
// @access Private
router.put("/:storyId/chapter/:chapterId/comment", (req, res) => {
    // res.send("update the comment data in chapter model of the story");
    try {
        const { storyId, chapterId } = req.params;
        const { username, userId, comment } = req.body;
        Chapter.findOneAndUpdate(
            { _id: chapterId, storyId },
            { $push: { comments: { storyId, username, userId, comment } } },
            (err, result) => {
                if (!result) throw "Invalid Story or Chapter ID";
                console.log("Comment has been added pushed");
                res.send(result);
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// @desc Delete comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment/:commentId
// @access Private
router.delete("/:storyId/chapter/:chapterId/comment/:commentId", (req, res) => {
    // res.send("delete the comment data in chapter model of the story");
    try {
        const { storyId, chapterId, commentId } = req.params;
        Chapter.findOneAndDelete(
            { _id: chapterId, storyId, "comments._id": commentId },
            (err, result) => {
                if (!result) throw "Invalid Story, Chapter or Comment ID";
                console.log("Comment has been deleted");
                res.send(result);
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
