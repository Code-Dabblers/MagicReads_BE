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
router.post("/register", (req, res) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;
        User.findOne({ email: email }, (err, user) => {
            if (err)
                return res.status(401).send({
                    message: "The credential information is incorrect",
                    error: err.message,
                });
            if (user) {
                console.log("email already taken");
                res.status(201).send({
                    auth: false,
                    data: "user exists already",
                });
            } else {
                bcrypt
                    .hash(password, BCRYPT_SALT_ROUNDS)
                    .then((hashedPassword) => {
                        User.create(
                            {
                                username,
                                password: hashedPassword,
                                email,
                                firstName,
                                lastName,
                            },
                            (err, user) => {
                                if (err)
                                    return res.status(401).send({
                                        message:
                                            "The credential information is incorrect",
                                        error: err.message,
                                    });
                                const token = jwt.sign(
                                    { _id: user._id },
                                    process.env.JWT_SECRET
                                );
                                res.status(200).send({
                                    auth: true,
                                    token: token,
                                    message: "User registration successful!",
                                });
                            }
                        );
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: "Internal Server Error",
                            error: err.message,
                        });
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

// @desc Login page
// @route POST /user/login
// @access Public
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then((user) => {
            if (user === null) {
                res.send({
                    message: "That email is not registered.",
                });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    return res.status(401).send({
                        message: "The credential information is incorrect",
                        error: err.message,
                    });

                if (isMatch) {
                    const token = jwt.sign(
                        { _id: user._id },
                        process.env.JWT_SECRET
                    );
                    res.status(200).send({
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
        })
        .catch((error) =>
            res.status(500).send({ error, message: "Internal Server Error" })
        );
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
            await Story.findOne({ _id: storyId }, async function (err, story) {
                if (err) return res.status(401).send({ error: err.message });
                await User.updateOne(
                    { _id: req.user._id },
                    { $addToSet: { "readingList.list": story._id } },
                    (err, user) => {
                        if (!user) throw err;
                        res.status(200).send({
                            message: "Story Added to the reading list",
                            storyId: story._id,
                        });
                    }
                );
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
router.put("/:storyId/library",     
passport.authenticate("jwt", { session: false }),
async (req, res) => {
    try {
        const { storyId } = req.params;
        await Story.findOne({ _id: storyId }, async function (err, story) {
            if (err) res.status(404).send({ message: err.message });
            await User.updateOne(
                { _id: req.user._id },
                { $addToSet: { "library.list": story._id } },
                (err, user) => {
                    if (!user) throw err;
                    res.status(200).send({
                        message: "Story Added to the reading list",
                        storyId: story._id,
                    });
                }
            );
        });
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}
    //res.send("Add the story to user library");
);

// @desc User Library
// @route GET /user/library
// @access Private
router.get("/library",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const userData = await User.findOne({ _id: req.user._id })
                .populate({ path: "library.list", model: "Story" })
                .lean();
            res.status(200).send({
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
    // res.send(
    //     "User will have an array of id's of stories in their library array in db, fetch them and send them as response"
    // );
);

// @desc User Settings
// @route GET /user/settings
// @access Private
router.get(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            await User.findOne({ _id: req.user._id }, (err, user) => {
                if (err) return res.status(401).send({ error: err.message });
                const data = {
                    username: user.username,
                    firstname: user.firstName,
                    lastname: user.lastName,
                };
                res.status(200).send({
                    userData: data,
                    message: "Current User Settings",
                });
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
// @route PUT /user/settings
// @access Private
router.put(
    "/settings",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { username, firstName, lastName } = req.body;
            const dataObj = {};
            if (username) dataObj.username = username;
            if (firstName) dataObj.firstName = firstName;
            if (lastName) dataObj.lastName = lastName;
            await User.findOne({ _id: req.user._id }, async (err, user) => {
                if (err) return res.status(401).send({ error: err.message });
                if (!user) res.status(404).send({ message: "User not found" });
                await User.updateOne({ _id: user._id }, { $set: dataObj });
                res.status(200).send({ message: "Updated user settings" });
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
    res.send("User Logged Out");
});

module.exports = router;
