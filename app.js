// Includes
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

// Auth and DB Includes
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const passport = require("passport");

dotenv.config({ path: "./config/config.env" });

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

// Cache Fix
app.disable("etag");

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", require("./routes/index.js"));
app.use("/user", require("./routes/user.js"));
app.use("/search", require("./routes/search.js"));
app.use("/storyname", require("./routes/storyname.js"));
app.use("/create", require("./routes/create.js"));
app.use("/edit", require("./routes/edit.js"));

const PORT = process.env.PORT || 3000;

// Server Listening
app.listen(
  PORT,
  console.log(
    `MagicReads is running in ${process.env.NODE_ENV} mode on server ${PORT}`
  )
);
