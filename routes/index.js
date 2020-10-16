const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

// @desc Landing page
// @route GET /
// @access Public
router.post("/", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/:user", async (req, res) => {
  try {
    await Story.create(req.body, async function (err, story) {
      await User.updateOne({ _id: req.params.user }, { $push: { myStories: { _id: story._id } } });
    });
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/user", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/chapter", async (req, res) => {
  try {
    await Chapter.create(req.body, async function (err, c) {
      await Story.updateOne({ _id: c.storyId }, { $push: { chapters: { _id: c._id } } });
    });
    res.send("it works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/comment/:id", async (req, res) => {
  try {
    await Chapter.updateOne(
      { storyId: req.params.id },
      {
        $push: {
          comments: {
            storyId: req.params.id,
            comment: req.body.comment,
            username: req.body.username,
            userId: req.body.userId,
          },
        },
      }
    );
    res.send("it works for chapter");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
