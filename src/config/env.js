const { cleanEnv, str, port } = require("envalid");

module.exports = cleanEnv(process.env, {
  PORT: port({
    default: 1000,
  }),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  REDIS_URL: str(),
  SWAGGERURLREQUEST: str(),
  NODE_ENV: str(),
  FRONTEND_URL: str({
    default: "http://localhost:5173",
  }),
});
