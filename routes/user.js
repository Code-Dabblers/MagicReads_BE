const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");

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
router.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      req.logIn(user, (err) => {
        console.log(user);
        const data = {
          username: user.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        };
        User.findOne({
          where: {
            username: data.username,
          },
        })
          .then((user) => {
            console.log(user);
            res.status(200).send({ message: "user created" });
          })
          .catch((err) => {
            console.log("something went wrong");
          });
      });
    }
  })(req, res, next);
});

// @desc Login page
// @route POST /user/login
// @access Public
router.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      req.logIn(user, (err) => {
        User.findOne({ username: user.username }).then((user) => {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          res.status(200).send({
            auth: true,
            token: token,
            message: "user found & logged in",
          });
        });
      });
    }
  })(req, res, next);
});

// @desc Login page
// @route GET /user/login
// @access Public
router.get("/login", (req, res) => {
  res.send("Login page");
});

// @desc Logout page
// @route POST /user/logout
// @access Public
router.get("/logout", (req, res) => {
  res.send("User Logged Out");
});

module.exports = router;
