const mongoose = require("mongoose");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  readingList: [{ storyId: { type: String, ref: "Story" } }],
  library: [{ storyId: { type: String, ref: "Story" } }],
  myStories: [{ _id: { type: String, ref: "Story" } }],
});

module.exports = mongoose.model("User", userSchema);
