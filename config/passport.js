const bcrypt = require("bcrypt");

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
    new localStrategy(
        {
            usernameField: "email",
            session: false,
        },
        (email, password, done) => {
            try {
                User.findOne({ email: email }).then((user) => {
                    if (user === null) {
                        return done(null, false, {
                            message: "That email is not registered.",
                        });
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: "Incorrect Password",
                            });
                        }
                    });
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("JWT"),
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
                    console.log("user found in db with passport");
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
