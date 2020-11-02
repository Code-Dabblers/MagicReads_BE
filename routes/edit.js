const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const passport = require("passport");

// @desc Edit story details
// @route PUT /edit/story/:storyID/details
// @access Private
router.put(
    "/story/:storyId/details",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            const story = await Story.findByIdAndUpdate(
                storyId,
                { $set: req.body },
                { new: true }
            ).lean();
            if (!story)
                return res.status(404).send({
                    message: "Invalid story ID",
                });
            const successMsg =
                "Story details have been edited";
            res.send({
                success: true,
                message: successMsg,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Edit chapter of a story
// @route PUT /edit/chapter/:chapterId/details
// @access Private
router.put(
    "chapter/:chapterId/details",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { chapterId } = req.params;
            const chapter = await Chapter.findByIdAndUpdate(
                chapterId,
                { $set: req.body },
                { new: true }
            ).lean();

            if (!chapter)
                return res.status(404).send({
                    message: "Invalid Chapter ID",
                });

            res.send({
                success: true,
                message: "Chapter details have been edited",
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Edit comment of a chapter
// @route PUT /edit/comment/:commentId
// @access Private
router.put(
    "/comment/:commentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { commentId } = req.params;
            const comment = await Comment.findByIdAndUpdate(
                commentId,
                { new: true }
            ).lean();
            if (!comment)
                return res.status(404).send({
                    message: "Invalid comment ID",
                });

            res.send({
                success: true,
                message: "Comment is edited successfully",
                newComment: comment.comment,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

module.exports = router;
