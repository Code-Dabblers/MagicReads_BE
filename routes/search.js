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
 *      description: Get the story based on query parameters & tags
 *      produces:
 *      -   "application/json"
 *      parameters:
 *            - name: query
 *              description: Search based on title or summary or genre name
 *              in: "path"
 *              type: "string"
 *              required: true
 *            - in: query
 *              name: tags
 *              description: Type any tags of the stories for eg horror
 *              type: "string"
 *              required: false
 *
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story with the passed query or tags  is not found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.get("/:query", async (req, res) => {
    const { query } = req.params;
    let tags = query.split(" ");
    const newTags = tags.map((tag) => {
        if (tag.indexOf("#") !== -1) {
            return tag.slice(1);
        }
        return tag;
    });
    await Story.find({ tags: { $in: newTags } })
        .populate({ path: "chapters", model: Chapter })
        .then((stories) => {
            if (stories.length === 0) res.send({ message: "NO STORY FOUND" });
            else res.send({ storyData: stories, message: "Stories Found" });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Failed: to search via query",
                success: true,
                error: err.message,
            });
        });
});

module.exports = router;
