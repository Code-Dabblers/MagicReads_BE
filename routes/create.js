const express = require("express");
const Story = require("../models/Story");
const User = require("../models/User");
const Chapter = require("../models/Chapter");
const router = express.Router();
const passport = require("passport");

// @desc Create story page
// @route POST /create
// @access Private
router.post(
    "/story",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            await Story.create(req.body, async function (err, story) {
                if (err) res.status(404).send({ message: err.message });
                await User.updateOne(
                    { _id: req.user._id },
                    { $push: { myStories: { _id: story._id } } }
                );
                res.status(200).send({
                    message: "Story Created",
                    storyId: story._id,
                });
            });
        } catch (err) {
            res.status(500).send({ message: "Internal Server Error" });
        }
        // this should return back a storyID which will be used to create the chapter
    }
);

// @desc Publish a chapter
// @route POST /create/story/:storyId/chapter
// @access Private
router.post(
    "/:storyId/chapter",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            console.log(storyId);

            // Checking if a story exists
            await Story.findOne({ _id: storyId }, async (err, story) => {
                console.log(story);
                if (!story)
                    res.status(404).send({ message: "Invalid story Id" });
                await Chapter.create(
                    { ...req.body, storyId },
                    async (err, chapter) => {
                        if (err) throw err;
                        console.log(chapter);
                        await Story.updateOne(
                            { _id: storyId },
                            {
                                $push: {
                                    chapters: chapter._id,
                                },
                            }
                        );
                        res.send("Chapter has been created");
                    }
                );
            });
        } catch (err) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
);

module.exports = router;
