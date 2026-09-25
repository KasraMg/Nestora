require("dotenv").config();
const env = require("./src/config/env");
const express = require("express");
const connectDB = require("./src/config/db");
const swaggerSpec = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const routes = require("./src/routes");
const redisClient = require("./src/config/redis");
const gracefulShutdown = require("./src/utils/shutdown");

const app = express();
app.set("trust proxy", 1);
(async () => {
  await connectDB();

  // try {
  //   await redisClient.connect();
  //   console.log("Redis connected");
  // } catch (err) {
  //   // console.warn("Redis unavailable:", err.message);
  // }
})();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const security = require("./src/middlewares/security.middleware");

app.use(security.helmet);
app.use(security.compression);
app.use(security.cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //

const { defaultLimiter } = require("./src/middlewares/rate-limit.middleware");
app.use(defaultLimiter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", routes);

const errorMiddleware = require("./src/middlewares/error.middleware");
app.use(errorMiddleware);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});

// process.on("SIGINT", () => {
//   gracefulShutdown(server);
// });

// process.on("SIGTERM", () => {
//   gracefulShutdown(server);
// });

// process.on("unhandledRejection", () => {
//   gracefulShutdown(server);
// });

// process.on("uncaughtException", () => {
//   gracefulShutdown(server);
// });
