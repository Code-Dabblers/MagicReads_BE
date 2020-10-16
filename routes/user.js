const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");

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
                res.send("user exists already");
            } else {
                bcrypt
                    .hash(password, BCRYPT_SALT_ROUNDS)
                    .then((hashedPassword) => {
                        User.create({
                            username: username,
                            password: hashedPassword,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                        })
                            .then((user) => {
                                const token = jwt.sign(
                                    { _id: user._id },
                                    process.env.JWT_SECRET
                                );
                                res.status(200).send({ token: token });
                            })
                            .catch((err) => console.log(err));
                        console.log("user created");
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// @desc Login page
// @route POST /user/login
// @access Public
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) throw err;

        if (info != undefined) {
            console.log(info.message);
            res.send(info.message);
        } else {
            req.logIn(user, (err) => {
                User.findOne({ email: user.email }).then((user) => {
                    const token = jwt.sign(
                        { _id: user._id },
                        process.env.JWT_SECRET
                    );
                    res.status(200).send({
                        auth: true,
                        token: token,
                        message: "User found & logged in",
                    });
                });
            });
        }
    })(req, res, next);
});

// @desc Logout page
// @route POST /user/logout
// @access Public
router.get("/logout", (req, res) => {
    req.logout();
    res.send("User Logged Out");
});

module.exports = router;
