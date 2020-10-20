const passport = require("passport");
const User = require("../models/User");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

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
