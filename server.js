// Includes
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const cors = require("cors");
const dotenv = require("dotenv");

// Auth and DB Includes
const passport = require("passport");
const connectDB = require("./config/db");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport");

// Database Connected
connectDB();

// Initialize App
const app = express();

app.use(cors());

// Cache Fix
app.disable("etag");

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override used for PUT or DELETE requests
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

// Static folder
app.use(express.static(path.join(__dirname, "/public")));

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Passport middleware
app.use(passport.initialize());

// cookie middleware
app.use(cookieParser());

// Connect Flash
app.use(flash());

// Set Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use("/", require("./routes/index.js"));
app.use("/user", require("./routes/user.js"));
app.use("/search", require("./routes/search.js"));
app.use("/storyname", require("./routes/story.js"));
app.use("/create", require("./routes/create.js"));
app.use("/edit", require("./routes/edit.js"));

// Port
const PORT = process.env.PORT || 8000;

// Server Listening
app.listen(
    PORT,
    console.log(
        `MagicReads is running in ${process.env.NODE_ENV} mode on server ${PORT}`
    )
);
