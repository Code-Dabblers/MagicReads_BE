const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const Comment = require("../models/Comment");
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
        try {
            const { storyId } = req.params;
            const story = await Story.findOne({ _id: storyId }).lean();
            if (!story)
                return res
                    .status(404)
                    .send({ success: false, message: "Invalid story ID" });

            res.send({
                success: true,
                message: "Story Found",
                storyData: story,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}/vote:
 *  patch:
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
    async (req, res) => {
        try {
            const story = await Story.findByIdAndUpdate(req.params.storyId, {
                $inc: { voteCount: 1 },
            }).lean();
            if (!story)
                res.status(404).send({
                    success: false,
                    message: "Invalid story ID",
                });
            res.status(200).send({
                success: true,
                message: "Story vote counter has been increased",
            });
        } catch (err) {
            res.status(500).send({
                success: false,
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
router.get("/:storyId/chapter/:chapterId", async (req, res) => {
    try {
        const { storyId, chapterId } = req.params;
        const chapter = await Chapter.findOne({ _id: chapterId, storyId });
        if (!chapter)
            return res.status(404).send({
                success: false,
                message: "Invalid Story or Chapter ID",
            });
        res.send({
            success: true,
            chapterData: chapter,
            message: "Chapter details have been fetched",
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}:
 *  delete:
 *      tags:
 *      -  "story"
 *      description: Delete the chapter of the story id and chapter id
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
router.delete("/:storyId/chapter/:chapterId", async (req, res) => {
    try {
        const { storyId, chapterId } = req.params;
        const chapter = await Chapter.findOne({ _id: chapterId }).lean();
        await Comment.deleteMany({ _id: { $all: chapter.comments } });
        await Story.updateOne(
            { _id: storyId },
            { $pull: { chapters: chapterId } }
        );
        await Chapter.deleteOne({ _id: chapterId });
        res.status(200).send({
            success: true,
            message: "Chapter deleted successfully",
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}/comment:
 *  post:
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

router.post(
    "/:storyId/chapter/:chapterId/comment",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId, chapterId } = req.params;
            const { username, _id: userId } = req.user;
            const { comment } = req.body;
            const dataObj = { storyId, chapterId, comment, username, userId };
            const commentData = await Comment.create(dataObj);
            await Chapter.updateOne(
                { _id: chapterId },
                { $push: { comments: commentData._id } }
            );
            res.status(200).send({
                success: true,
                message: "Comment added successfully",
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}/chapter/{chapterId}/comment/{commentId}:
 *  patch:
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
router.patch(
    "/:storyId/chapter/:chapterId/comment/:commentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId, chapterId, commentId } = req.params;
            const comment = await Comment.findOneAndDelete({ _id: commentId });
            console.log(comment);
            await Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                { $pull: { comments: commentId } }
            );
            res.send({
                success: true,
                message: "Comment deleted successfully",
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

module.exports = router;
