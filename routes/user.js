const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Story = require("../models/Story");
const BCRYPT_SALT_ROUNDS = 12;
const User = require("../models/User");

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
            const hashedPassword = await bcrypt.hash(
                password,
                BCRYPT_SALT_ROUNDS
            );
            const user = await User.create({
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName,
            });
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: Math.floor(Date.now() / 1000) + 36 * 60 * 60,
            });
            res.status(200).send({
                success: true,
                auth: true,
                token: token,
                message: "User registration successful!",
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

// @desc Login page
// @route POST /user/login
// @access Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).lean();
        if (user === null) {
            return res.send({
                message: "That email is not registered.",
            });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err)
                return res.status(401).send({
                    success: false,
                    message: "Some credentials are missing",
                    error: err.message,
                });
            if (isMatch) {
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: Math.floor(Date.now() / 1000) + 36 * 60 * 60 }
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
            success: false,
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
            const story = await Story.findOne({ id: storyId }).lean();
            if (!story)
                return res
                    .status(401)
                    .send({ success: false, message: "Invalid story ID" });
            await User.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { "readingList.list": storyId } },
                { new: true }
            );

            res.status(200).send({
                success: true,
                message: "Story Added to the reading list",
                storyId: storyId,
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
                readingList: userData.readingList.list,
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

// @desc Add story to User's Library
// @route PUT /user/:storyId/readingList
// @access Private/Public
router.put(
    "/:storyId/library",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { storyId } = req.params;
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { "library.list": storyId },
            }).lean();
            res.status(200).send({
                success: true,
                message: "Story Added to the library list",
                storyId: storyId,
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
                library: userData.library.list,
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

// @desc User Settings
// @route GET /user/settings
// @access Private
router.get(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user._id }).lean();
            const { username, firstName, lastName } = user;
            const data = {
                username,
                firstName,
                lastName,
            };
            res.status(200).send({
                success: true,
                message: "Current User Settings",
                userData: data,
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

// @desc User Settings
// @route PUT /user/settings
// @access Private
router.put(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { username, firstName, lastName } = req.body;
            const dataObj = {};
            if (username) {
                const user = await User.findOne({ username: username }).lean();
                if (user.username === username)
                    return res.status(409).send({
                        success: false,
                        message: "Username already exists",
                    });
                dataObj.username = username;
            }
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
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Login page
// @route DELETE /user/delete
// @access Private
router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        // delete comments created by that user
        // delete stories created by that user
        // delete chapters created by that user
        // delete User
    }
);

module.exports = router;
