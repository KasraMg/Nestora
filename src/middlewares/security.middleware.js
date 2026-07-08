const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

exports.helmet = helmet({
  crossOriginResourcePolicy: false,
});

exports.compression = compression();

exports.cors = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});