const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const passport = require("passport");

/**
 * @swagger
 * /story/{storyId}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *      -  "story"
 *      description: Get the story with the story id
 *      produces:
 *      -   "application/json"
 *      parameters:
 *      - name: storyId
 *        description: ID of the story to return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story with the passed id is not found
 *          "500":
 *              description: Unhandled error scenario has occured
 */

router.get(
    "/:storyId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { storyId } = req.params;
        console.log(storyId);
        try {
            const stories = await Story.findOne(
                { _id: storyId },
                (err, story) => {
                    if (!story)
                        res.status(404).send({ message: "Invalid story Id" });
                    return story;
                }
            ).lean();

            res.send({ storyData: stories, message: "Story Found" });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}/vote:
 *  put:
 *      tags:
 *      -  "story"
 *      description: Update Vote on a story
 *      security:
 *      - bearerAuth: []
 *      produces:
 *      -   "application/json"
 *      parameters:
 *      - name: storyId
 *        description: ID of the story to vote and return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story with the passed id is not found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.patch(
    "/:storyId/vote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("increase the story vote counter");
        try {
            Story.findByIdAndUpdate(
                req.params.storyId,
                { $inc: { voteCount: 1 } },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Story with this ID is not found",
                        });
                    console.log("Story vote counter has been increased");
                    res.send(result);
                }
            ).lean();
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}:
 *  get:
 *      tags:
 *      -  "story"
 *      description: Get the chapter of the story id and chapter id
 *      produces:
 *      -   "application/json"
 *      parameters:
 *      - name: storyId
 *        description: ID of the story find the chapter from
 *        in: "path"
 *        type: "string"
 *        required: true
 *      - name: chapterId
 *        description: ID of the chapter to find and return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story id or chapter id passed is not valid or found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.get("/:storyId/chapter/:chapterId", (req, res) => {
    // res.send("fetch story details with that id");
    const { storyId, chapterId } = req.params;
    try {
        Chapter.findOne({ _id: chapterId, storyId }, (err, chapter) => {
            if (!chapter)
                res.status(404).send({
                    message: "Invalid Story or Chapter ID",
                });
            console.log("Chapter details have been fetched");
            res.send(chapter);
        }).lean();
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}/comment:
 *  put:
 *      tags:
 *      -  "story"
 *      description: Add comment on a chapter
 *      produces:
 *      -   "application/json"
 *      security:
 *      -   bearerAuth: []
 *      parameters:
 *      - name: storyId
 *        description: ID of the story find the chapter from
 *        in: "path"
 *        type: "string"
 *        required: true
 *      - name: chapterId
 *        description: ID of the chapter to find, comment and return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story id or chapter id passed is not valid or found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.patch(
    "/:storyId/chapter/:chapterId/comment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("update the comment data in chapter model of the story");
        try {
            const { storyId, chapterId } = req.params;
            const { username, userId, comment } = req.body;
            Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                { $push: { comments: { storyId, username, userId, comment } } },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Invalid Story or Chapter ID",
                        });
                    console.log("Comment has been added pushed");
                    res.send(result);
                }
            ).lean();
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}/comment/{commentId}:
 *  delete:
 *      tags:
 *      -  "story"
 *      description: Delete comment on a chapter
 *      produces:
 *      -   "application/json"
 *      security:
 *      -   bearerAuth: []
 *      parameters:
 *      - name: storyId
 *        description: ID of the story find the chapter from
 *        in: "path"
 *        type: "string"
 *        required: true
 *      - name: chapterId
 *        description: ID of the chapter to find, comment and return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      - name: commentId
 *        description: ID of the comment to find, and delete
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 *          "404":
 *              description: Story id, chapter id or comment id passed is not valid or found
 *          "500":
 *              description: Unhandled error scenario has occured
 */
router.delete(
    "/:storyId/chapter/:chapterId/comment/:commentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("delete the comment data in chapter model of the story");
        try {
            const { storyId, chapterId, commentId } = req.params;
            Chapter.findOneAndDelete(
                { _id: chapterId, storyId, "comments._id": commentId },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Invalid Story, Chapter or Comment ID",
                        });
                    console.log("Comment has been deleted");
                    res.send(result);
                }
            ).lean();
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

module.exports = router;
