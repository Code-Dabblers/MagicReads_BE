// Includes
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

// Auth and DB Includes
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Database Connected
connectDB();

// Initialize App
const app = express();

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

// Sessions
app.use(
  session({
    secret: "reading is love",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

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
app.use("/storyname", require("./routes/storyname.js"));
app.use("/create", require("./routes/create.js"));
app.use("/edit", require("./routes/edit.js"));

// Port
const PORT = process.env.PORT || 3000; // add that file

// Server Listening
app.listen(
  PORT,
  console.log(
    `MagicReads is running in ${process.env.NODE_ENV} mode on server ${PORT}`
  )
);
