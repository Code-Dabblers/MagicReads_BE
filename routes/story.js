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
            console.log(err);
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

/**
 * @swagger
 * /story/{storyId}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *      -  "story"
 *      description: Deůete the story with the story id
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

router.delete(
    "/:storyId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { storyId } = req.params;
        try {
            const storyData = await Story.deleteOne({ _id: storyId });
            if (!storyData)
                return res.status(404).send({ message: "Invalid story Id" });

            await Chapter.deleteMany({ storyId });
            await Comment.deleteMany({ storyId });
            console.log("Story with given ID has been deleted");
            res.status(200).send({
                message: "Story with given ID has been deleted",
            });
        } catch (err) {
            console.log(err);
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
 *  put:
 *      tags:
 *      -  "story"
 *      description: Add the Vote on a story
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
router.put(
    "/:storyId/vote",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            console.log(storyId);
            const story = await Story.findById(storyId).lean();
            if (!story)
                res.status(404).send({
                    success: false,
                    message: "Invalid story ID",
                });
            if (story.votedBy.indexOf(req.user._id) !== -1)
                return res.status(409).send({
                    success: false,
                    message: "User already voted for this story",
                });
            await Story.findByIdAndUpdate(req.params.storyId, {
                $push: { votedBy: req.user._id },
            }).lean();
            res.status(200).send({
                success: true,
                message: "You have voted for this story",
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
 *  delete:
 *      tags:
 *      -  "story"
 *      description: Delete the Vote on a story
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
router.delete(
    "/:storyId/vote",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            console.log(storyId);
            const story = await Story.findById(storyId).lean();
            if (!story)
                res.status(404).send({
                    success: false,
                    message: "Invalid story ID",
                });
            if (story.votedBy.indexOf(req.user._id) === -1)
                return res.status(409).send({
                    success: false,
                    message: "User have not voted for this story ever",
                });
            await Story.findByIdAndUpdate(req.params.storyId, {
                $pull: { votedBy: req.user._id },
            }).lean();
            res.status(200).send({
                success: true,
                message: "You have removed your vote for this story",
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
            message: "Chapter details have been fetched",
            chapterData: chapter,
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
        if (!chapter)
            return res
                .status(401)
                .send({ success: false, message: "Chapter does not exist" });
        await Comment.deleteMany({ chapterId });
        await Story.findByIdAndUpdate(storyId, {
            $pull: { chapters: chapterId },
        });
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
            const chapter = await Chapter.findById(chapterId).lean();
            if (!chapter)
                return res.status(404).send({ message: "Invalid chapter Id" });
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
    async (req, res) => {
        try {
            const { storyId, chapterId, commentId } = req.params;
            const story = await Story.findOne({ _id: storyId }).lean();
            const comment = await Comment.findOneAndDelete({
                _id: commentId,
            }).lean();
            const chapter = await Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                { $pull: { comments: commentId } },
                { new: true }
            ).lean();
            if (!chapter || !comment || !story) {
                return res.status(404).send({
                    success: false,
                    message: "Invalid Story, Comment or Chapter ID",
                });
            }
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
