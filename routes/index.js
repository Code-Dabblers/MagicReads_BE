const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

router.get("/", async (req, res) => {
    try {
        res.redirect("/api-docs");
    } catch (err) {
        console.log(err);
    }
});

/**
 * @swagger
 * /dashboard:
 *  get:
 *      tags:
 *      -  "dashboard"
 *      description: Use to fetch all the public stories to dashboard
 *      responses:
 *          "200":
 *              description: A successful response
 */

router.get("/dashboard", async (req, res) => {
    try {
        res.send("fetch all public stories data (make sure to pass story ids)");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
