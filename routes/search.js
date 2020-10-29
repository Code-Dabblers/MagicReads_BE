const express = require("express"),
    router = express.Router(),
    Story = require("../models/Story"),
    mongoose = require("mongoose"),
    Chapter = require("../models/Chapter");

// @desc Search
// @route GET /search
// @access Public
router.get("/", (req, res) => {
    res.send("it should work tooo");
});

// @desc Serach from query
// @route GET /search/:query
// @access Public
router.get("/:query", async (req, res) => {
    const { query } = req.params;
    await Story.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
    )
        .populate({ path: "chapters", model: Chapter })
        .then((stories) => {
            if (stories.length === 0) res.send({ message: "NO STORY FOUND" });
            else res.send({ storyData: stories, message: "Story Found" });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Failed: to search via query",
                success: true,
                result: err,
            });
        });
});

// @desc Serach from query and tag
// @route GET /search/:query/:tag
// @access Public
router.get("/:query?/:tag", (req, res) => {
    res.send(
        "e.g /search/romance/humour should show stories with that keyword which can be in story name, description, genre along with having the tag of humour"
    );
});

module.exports = router;
