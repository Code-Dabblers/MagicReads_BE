const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const passport = require("passport");

// @desc Edit story details
// @route PUT /edit/story/:storyID/details
// @access Private
router.patch(
    "/story/:storyId/details",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            const data = await Story.findOneAndUpdate(
                { _id: storyId },
                req.body
            ).lean();
            if (!data)
                return res.status(404).send({
                    message: "Story with this ID is not found",
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
// @route Get /edit/story/:storyID/details
// @access Private
router.patch(
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
