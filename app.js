// Includes
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 3000;

// Server Listening
app.listen(
  PORT,
  console.log(
    `MagicReads is running in ${process.env.NODE_ENV} mode on server ${PORT}`
  )
);
