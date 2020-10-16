const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 12;

const passport = require("passport"),
  localStrategy = require("passport-local").Strategy,
  User = require("../models/User"),
  JWTstrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "register",
  new localStrategy(
    {
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      try {
        User.findOne({
          where: {
            username: username,
          },
        }).then((user) => {
          if (user != null) {
            console.log("username already taken");
            return done(null, false, { message: "username already taken" });
          } else {
            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
              User.create({
                username,
                password: hashedPassword,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
              })
                .then((user) => {
                  console.log("user created");

                  return done(null, user);
                })
                .catch((err) => console.log(err));
            });
          }
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    (username, password, done) => {
      try {
        User.findOne({ username: username }).then((user) => {
          if (user === null) {
            return done(null, false, { message: "bad username" });
          } else {
            bcrypt.compare(password, user.password).then((response) => {
              if (response !== true) {
                console.log("passwords do not match");
                return done(null, false, { message: "passwords do not match" });
              }
              console.log("user found & authenticated");
              return done(null, user);
            });
          }
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        _id: jwt_payload._id,
      }).then((user) => {
        if (user) {
          console.log("user found in db in passport");
          done(null, user);
        } else {
          console.log("user not found in db");
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  })
);

module.exports = passport;
