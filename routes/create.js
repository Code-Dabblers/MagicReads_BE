const express = require("express");
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
router.post("/:storyId/chapter", (req, res) => {
  res.send("Create a chapter and push it into Chapter data collection");
});

module.exports = router;
