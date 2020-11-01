const express = require("express"),
    router = express.Router(),
    Story = require("../models/Story"),
    mongoose = require("mongoose"),
    Chapter = require("../models/Chapter");

// @desc Serach from query
// @route GET /search/:query
// @access Public
/**
 * @swagger
 * /search/{query}:
 *  get:
 *      tags:
 *      -  "search"
 *      description: Get the story based on tags
 *      produces:
 *      -   "application/json"
 *      parameters:
 *            - name: query
 *              description: Search based on title or summary or genre name
 *              in: "path"
 *              type: "string"
 *              required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story with the passed query or tags  is not found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.get("/:query", async (req, res) => {
    try {
        const { query } = req.params;
        let tags = query.split(" ");
        const newTags = tags.map((tag) => {
            if (tag.indexOf("#") !== -1) {
                return tag.slice(1);
            }
            return tag;
        });
        const stories = await Story.find({ tags: { $in: newTags } })
            .populate({ path: "chapters", model: Chapter })
            .lean();
        if (stories.length === 0)
            return res.send({ message: "NO STORY FOUND" });
        res.send({
            message: "Stories Found",
            success: true,
            storyData: stories,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Failed: to search via query",
            error: err.message,
        });
    }
});

module.exports = router;
