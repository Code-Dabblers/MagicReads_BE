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

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 3000;

// Server Listening
app.listen(
  PORT,
  console.log(
    `MagicReads is running in ${process.env.NODE_ENV} mode on server ${PORT}`
  )
);
