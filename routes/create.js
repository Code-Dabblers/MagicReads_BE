const express = require("express");
const Story = require("../models/Story");
const User = require("../models/User");
const Chapter = require("../models/Chapter");
const router = express.Router();

// @desc Create story page
// @route POST /create
// @access Private
router.post("/", (req, res) => {
  router.post("/", async(req, res) => {
    try {
              await Story.create(req.body, async function (err, story) {
                  await User.updateOne(
                      { _id: req.params.user },
                      { $push: { myStories: { _id: story._id } } }
                  );
              });
              res.send("Story Created");
          } catch (err) {
              console.log(err);
          }
     // this should return back a storyID which will be used to create the chapter 
  });
});

// @desc Publish a chapter
// @route POST /create/story/:storyId/chapter
// @access Private
router.post("/:storyId/chapter", async (req, res) => {
    try {
        const { storyId } = req.params;

        // Checking if a story exists
        await Story.findOne({ _id: storyId }, (err, story) => {
            if (!story) throw "Invalid Story ID";
        });

        await Chapter.create({ ...req.body, storyId }, async (err, chapter) => {
            await Story.updateOne(
                { _id: storyId },
                { $push: { chapters: { _id: chapter._id } } }
            );
        });
        res.send("Chapter has been created");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
