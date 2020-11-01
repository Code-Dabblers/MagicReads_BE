const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Story = require("../models/Story");
const BCRYPT_SALT_ROUNDS = 12;
const User = require("../models/User");

// @desc Landing page
// @route GET /user
// @access Private
router.get("/", (req, res) => {
    res.send("user dashboard");
});

// @desc Register page
// @route POST /user/register
// @access Public
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;
        const user = await User.findOne({ email }).lean();
        if (user) {
            res.status(201).send({
                success: false,
                data: "User with this email already exists",
            });
        } else {
            const hashedPassword = bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
            await User.create({
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName,
            });
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.status(200).send({
                success: true,
                auth: true,
                token: token,
                message: "User registration successful!",
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

// @desc Login page
// @route POST /user/login
// @access Public
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.findOne({ email }).lean();
        if (user === null) {
            res.send({
                message: "That email is not registered.",
            });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET
                );
                res.status(200).send({
                    success: true,
                    auth: true,
                    token: token,
                    message: "User found & logged in",
                });
            } else {
                res.send({
                    message: "Incorrect Password",
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

// @desc Add story to User's Reading List
// @route PUT /user/:storyId/readingList
// @access Private
router.put(
    "/:storyId/readingList",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            const story = await Story.findByIdAndUpdate(storyId, {
                $addToSet: { "readingList.list": story._id },
            }).lean();
            res.status(200).send({
                message: "Story Added to the reading list",
                storyId: story._id,
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc User Reading List
// @route GET /user/readingList
// @access Private
router.get(
    "/readingList",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const userData = await User.findOne({ _id: req.user._id })
                .populate({ path: "readingList.list", model: "Story" })
                .lean();
            res.status(200).send({
                success: true,
                message: "Reading List Found",
                readingList: userData.readingList,
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Add story to User's Library
// @route POST /user/:storyId/readingList
// @access Private/Public
router.put(
    "/:storyId/library",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            const story = await Story.findByIdAndUpdate(storyId, {
                $addToSet: { "library.list": story._id },
            }).lean();
            res.status(200).send({
                success: true,
                message: "Story Added to the reading list",
                storyId: story._id,
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc User Library
// @route GET /user/library
// @access Private
router.get(
    "/library",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const userData = await User.findOne({ _id: req.user._id })
                .populate({ path: "library.list", model: "Story" })
                .lean();
            res.status(200).send({
                success: true,
                message: "Library Found",
                readingList: userData.readingList,
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc User Settings
// @route GET /user/settings
// @access Private
router.get(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user._id }).lean();
            const data = {
                username: user.username,
                firstname: user.firstName,
                lastname: user.lastName,
            };
            res.status(200).send({
                success: true,
                message: "Current User Settings",
                userData: data,
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc User Settings
// @route PATCH /user/settings
// @access Private
router.patch(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { username, firstName, lastName } = req.body;
            const dataObj = {};
            if (username) dataObj.username = username;
            if (firstName) dataObj.firstName = firstName;
            if (lastName) dataObj.lastName = lastName;
            await User.findByIdAndUpdate(req.user._id, {
                $set: dataObj,
            }).lean();
            res.status(200).send({
                success: true,
                message: "Updated user settings",
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Logout page
// @route GET /user/logout
// @access Private
router.get("/logout", (req, res) => {
    res.send({ message: "User Logged Out", success: true });
});

module.exports = router;
