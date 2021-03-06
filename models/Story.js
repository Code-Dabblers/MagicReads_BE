const mongoose = require("mongoose");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

const storySchema = new mongoose.Schema({
    _id: { type: String, default: () => nanoid() },
    summary: { type: String, required: true },
    storyName: { type: String, required: true },
    tags: [{ type: String }],
    votedBy: [{ type: String }],
    cover: { type: String },
    genre: { type: String, required: true },
    visibility: { type: String, required: true, enum: ["public", "private"] },
    chapters: [{ type: String, ref: "Chapter" }],
    author: {
        username: { type: String, required: true },
        userId: { type: String, required: true },
    },
});

/// create index for tags search
storySchema.index({
    tags: 1,
});

module.exports = mongoose.model("Story", storySchema);
