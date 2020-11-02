const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

router.get("/", (req, res) => {
    res.redirect("/api-docs");
});

/**
 * @swagger
 * /stories:
 *  get:
 *      tags:
 *      -  "dashboard"
 *      description: Use to fetch all the public stories
 *      responses:
 *          "200":
 *              description: A successful response
 *          "500":
 *              description: Unhandled error scenario has occured
 */

router.get("/stories", async (req, res) => {
    try {
        const storyData = await Story.find({
            visibility: "public",
        }).lean();
        res.status(200).send({
            success: true,
            message: "Public stories data",
            stories: storyData,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

module.exports = router;
