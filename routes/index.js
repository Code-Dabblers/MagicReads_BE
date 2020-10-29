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

// Some code I tried to test that all connections are connected and we can add stories, chapters and comments.
// By no means this is the code which can be used as I used random routes just to know if the API will work,
// you can refer to this code although.

// router.get(
//     "/user",
//     passport.authenticate("jwt", { session: false }),
//     async (req, res) => {
//         try {
//             res.send(req.user);
//         } catch (err) {
//             console.log(err);
//         }
//     }
// );

// router.post("/:user", async (req, res) => {
//     try {
//         await Story.create(req.body, async function (err, story) {
//             await User.updateOne(
//                 { _id: req.params.user },
//                 { $push: { myStories: { _id: story._id } } }
//             );
//         });
//         res.send("it works");
//     } catch (err) {
//         console.log(err);
//     }
// });

// router.post("/chapter", async (req, res) => {
//     try {
//         await Chapter.create(req.body, async function (err, c) {
//             await Story.updateOne(
//                 { _id: c.storyId },
//                 { $push: { chapters: { _id: c._id } } }
//             );
//         });
//         res.send("it works");
//     } catch (err) {
//         console.log(err);
//     }
// });

// router.post("/comment/:id", async (req, res) => {
//     try {
//         await Chapter.updateOne(
//             { storyId: req.params.id },
//             {
//                 $push: {
//                     comments: {
//                         storyId: req.params.id,
//                         comment: req.body.comment,
//                         username: req.body.username,
//                         userId: req.body.userId,
//                     },
//                 },
//             }
//         );
//         res.send("it works for chapter");
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = router;
