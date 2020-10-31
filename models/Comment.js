const mongoose = require("mongoose");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

const commentSchema = new mongoose.Schema({
    _id: { type: String, default: () => nanoid() },
    storyId: { type: String, required: true },
    chapterId: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    comment: { type: String, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
