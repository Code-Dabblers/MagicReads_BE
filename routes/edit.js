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
    (req, res) => {
        try {
            const { storyId } = req.params;
            const data = req.body;
            Story.findByIdAndUpdate(storyId, data, (err, result) => {
                if (!result)
                    res.status(404).send({
                        message: "Story with this ID is not found",
                    });
                console.log("Story details have been edited");
                res.send(result);
            });
        } catch (err) {
            res.status(500).send({
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
    (req, res) => {
        try {
            const { storyId, chapterId } = req.params;
            const data = req.body;
            Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                data,
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Invalid Story or Chapter ID",
                        });
                    console.log("Chapter details have been edited");
                    res.send(result);
                }
            );
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

module.exports = router;
