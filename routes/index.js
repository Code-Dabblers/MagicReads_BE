const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const passport = require("passport");

/**
 * @swagger
 * - name: user
 * /:
 *  get:
 *      description: Use to fetch all the public stories
 *      responses:
 *          "200":
 *              description: A successful response
 */

router.get("/", async (req, res) => {
    try {
        res.send("fetch all public stories data (make sure to pass story ids)");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
