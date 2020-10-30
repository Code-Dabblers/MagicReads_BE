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
    password: {
        min: 8,
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    readingList: [
        {
            visibility: {
                type: String,
                required: true,
                enum: ["public", "private"],
                default: "private",
            },
            list: { type: String, ref: "Story" },
        },
    ],
    library: [
        {
            visibility: {
                type: String,
                required: true,
                enum: ["public", "private"],
                default: "private",
            },
            list: { type: String, ref: "Story" },
        },
    ],
    myStories: [{ type: String, ref: "Story" }],
});

module.exports = mongoose.model("User", userSchema);
