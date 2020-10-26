const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// @desc Story summary
// @route GET /story/:storyId
// @access Public
router.get("/:storyId", (req, res) => {
    const { storyId } = req.params.storyId;
    try {
        Story.findOne({ _id: storyId }, (err, story) => {
            if (!story) throw "Invalid Story ID";
        }).lean();
        res.send("fetch story details with that params.storyId");
    } catch (err) {
        console.log(err);
    }
});

// @desc Story Vote update
// @route PUT /story/:storyId/vote
// @access Private
router.put("/:storyId/vote", (req, res) => {
    const { storyId } = req.params.storyId;

    try {
        Story.findOne({ _id: storyId }, (err, story) => {
            if (!story) throw "Invalid Story ID";
        });

        var voteCount = story.voteCount + 1;
        var newvalues = { $set: { voteCount: voteCount } };
        Story.updateOne({ ...req.body, storyId }, { _id: storyId }, newvalues);
        res.send("increase the story vote counter");
    } catch (err) {
        console.log(err);
    }
});

// @desc Chapter of the Story
// @route GET /story/:storyId/chapter/:chapterId
// @access Public
router.get('/:storyId/chapter/:chapterId', (req, res) => {
	res.send('fetch story details with that id');
});

// @desc Add comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment
// @access Private
router.put('/:storyId/chapter/:chapterId/comment', (req, res) => {
	res.send('update the comment data in chapter model of the story');
});

// @desc Delete comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment/:commentId
// @access Private
router.delete('/:storyId/chapter/:chapterId/comment/:commentId', (req, res) => {
	res.send('delete the comment data in chapter model of the story');
});

module.exports = router;
