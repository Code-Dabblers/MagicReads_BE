const express = require("express");
const router = express.Router();

// @desc Search page
// @route GET /search
// @access Private
router.get("/", (req, res) => {
    res.send("it should work tooo");
});

// @desc Serach from query page
// @route GET /search/:query
// @access Public
router.get("/:query", (req, res) => {
    res.send(
        "e.g /search/horror should show stories with that keyword which can be in story name, description, genre or tag"
    );
});

// @desc Serach from query page
// @route GET /search/:query/:tag
// @access Public
router.get("/:query/:tag", (req, res) => {
    res.send(
        "e.g /search/romance/humour should show stories with that keyword which can be in story name, description, genre along with having the tag of humour"
    );
});

module.exports = router;
