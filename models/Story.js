const mongoose = require("mongoose");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

const storySchema = new mongoose.Schema({
  storyId: { type: String, required: true },
  storyName: { type: String, required: true },
  tags: [{ type: String }],
  totalChapters: { type: Number, required: true },
  voteCount: { type: Number, required: true },
  cover: { type: String, required: true },
  genre: { type: String, required: true },
  visiblity: { type: Boolean, required: true },
  chapters: [{ _id: String }],
  author: {
    username: { type: String, required: true },
    userId: { type: String, required: true },
  },
});
module.exports = mongoose.model("Story", storySchema);
