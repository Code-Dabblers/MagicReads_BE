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
            const { username, _id } = req.user;
            req.body.author = {};
            req.body.author.username = username;
            req.body.author.userId = _id;
            const story = await Story.create(req.body);
            await User.updateOne(
                { _id: _id },
                { $push: { myStories: story._id } }
            );
            res.status(200).send({
                success: true,
                message: "Story Created",
                storyId: story._id,
                storyData: story,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
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
            const { username, _id } = req.user;
            req.body.author = {};
            req.body.author.username = username;
            req.body.author.userId = _id;
            const { storyId } = req.params;

            const chapter = await Chapter.create({ ...req.body, storyId });
            if (!chapter) res.status(404).send({ message: "Invalid story Id" });
            await Story.findByIdAndUpdate(storyId, {
                $push: { chapters: chapter._id },
            });
            res.send({
                success: true,
                message: "Chapter has been created",
                chapterId: chapter._id,
                chapter,
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
