const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
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
    const { email, password, firstName, lastName, username } = req.body;
    User.findOne({
        email: email,
    })
        .then((user) => {
            if (user) {
                console.log("email already taken");
                res.setHeader("Content-Type", "application/json");
                res.status(201).send({
                    auth: false,
                    data: "user exists already",
                });
            } else {
                bcrypt
                    .hash(password, BCRYPT_SALT_ROUNDS)
                    .then((hashedPassword) => {
                        User.create({
                            username,
                            password: hashedPassword,
                            email,
                            firstName,
                            lastName,
                        })
                            .then((user) => {
                                const token = jwt.sign(
                                    { _id: user._id },
                                    process.env.JWT_SECRET
                                );
                                console.log("user created");
                                res.status(200).send({
                                    auth: true,
                                    token: token,
                                    message: "User registration successful!",
                                });
                            })
                            .catch((error) =>
                                res.status(500).send({
                                    message: "Internal server error",
                                    error,
                                })
                            );
                    });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({
                message: "Internal server error",
                error,
            });
        });
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
                if (err) throw err;

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
// @route POST /user/:storyId/readingList
// @access Private
router.post("/:storyId/readingList", 
passport.authenticate("jwt", { session: false }),
async(req, res) => {
        try {
            await Story.findOne({ _id: storyId }, async function (err, story) {
                if (err) res.status(404).send({ message: err.message });
                await User.updateOne(
                    { _id: req.user._id },
                    { $push: { readingList: { _id: story._id } } }
                );
                res.status(200).send({
                    message: "Story Added to the reading list",
                    storyId: story._id,
                });
            });
        } catch (err) {
            res.status(500).send({ message: "Internal Server Error" });
    }
   // res.send("Add the story to user reading list");
});

// @desc User Reading List
// @route GET /user/readingList
// @access Private
router.get("/readingList", 
passport.authenticate("jwt", { session: false }),
async(req, res) => {
    try {
        const stories = await Story.find({
          user: req.params._id,
          visibility: 'public',
        })
          .populate('user')
          .lean()
    
          res.status(200).send({
            message: "Reading list of user",
            storyId: {stories}
        });
      } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    // res.send(
    //     "User will have an array of id's of stories in their readingList array in db, fetch them and send them as response"
    // );
});

// @desc Add story to User's Library
// @route POST /user/:storyId/readingList
// @access Private/Public
router.post("/:storyId/library", (req, res) => {
    res.send("Add the story to user library");
});

// @desc User Library
// @route GET /user/library
// @access Private
router.get("/library", (req, res) => {
    res.send(
        "User will have an array of id's of stories in their library array in db, fetch them and send them as response"
    );
});

// @desc User Settings
// @route GET /user/settings
// @access Private
router.get("/settings", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        await User.findOne({_id: req.user._id}, (err, user) => {
            console.log(user)
            const data = {
                username: user.username,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName
            }
            res.status(200).send({ userData: data })
        }).lean()
    } catch(err) {
        res.status(500).send({ 
            message: "Internal Server Error",
            error: err.message })
    }
});

// @desc User Settings
// @route PUT /user/settings
// @access Private
router.put("/settings", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {

    try {
        const userDetails = await User.findOne({_id: req.user._id}, async(err, user)=>{
            if(!user) res.status(404).send({message: "User not found"})
            await User.updateOne({_id: user._id}, {$set: req.body})
            res.status(200).send({message: "Updated user settings"})
        })
    } catch (err) {
        res.status(500).send({ 
            message: "Internal Server Error",
            error: err.message })
    }
    
});

// @desc Logout page
// @route GET /user/logout
// @access Private
router.get("/logout", (req, res) => {
    res.send("User Logged Out");
});

module.exports = router;
