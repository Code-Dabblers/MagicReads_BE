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
            const story = await Story.findOneAndUpdate(
                { _id: storyId },
                req.body
            ).lean();
            if (!story)
                return res.status(404).send({
                    message: "Invalid story ID",
                });
            const successMsg = "Story details have been edited";
            res.send({ success: true, message: successMsg });
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
// @route PUT /edit/story/:storyID/details
// @access Private
router.put(
    "/story/:storyId/chapter/:chapterId/details",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId, chapterId } = req.params;
            const data = await Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                req.body
            ).lean();

            if (!data)
                return res.status(404).send({
                    message: "Invalid Story or Chapter ID",
                });
            const successMsg = "Chapter details have been edited";
            res.send({ success: true, message: successMsg });
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
