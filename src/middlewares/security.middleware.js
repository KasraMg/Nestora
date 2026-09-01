const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const env = require("../config/env");

exports.helmet = helmet({
  crossOriginResourcePolicy: false,
});

exports.compression = compression();

exports.cors = cors({
  origin: [
    env.FRONTEND_URL,
    env.FRONTEND_v2_URL,
    env.FRONTEND_v3_URL,
    "http://localhost:5173",
  ],
  credentials: true,
});
