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
 * /search/{query}?:
 *  get:
 *      tags:
 *      -  "search"
 *      description: Get the story based on query parameters & tags
 *      produces:
 *      -   "application/json"
 *      parameters:
 *      - name: query
 *        description: ID of the story to return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story with the passed query or tags  is not found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.get("/:query?", async (req, res) => {
    const { query } = req.params;
    const { tags } = req.query;
    await Story.find(
        {
            $or: [
                { tags: { $in: tags ? tags : [] } },
                { $text: { $search: query ? query : "" } },
            ],
        },
        { score: { $meta: "textScore" } }
    )
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
