require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const redisClient = require("./src/config/redis");
const swaggerSpec = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const routes = require("./src/routes");

const app = express();

app.set("trust proxy", 1);

app.use(async (req, res, next) => {
  try {
    await connectDB();

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    next();
  } catch (error) {
    console.error("Service connection error:", error.message);
    next(error);
  }
});

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec),
);

const security = require("./src/middlewares/security.middleware");

app.use(security.helmet);
app.use(security.compression);
app.use(security.cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { defaultLimiter } = require("./src/middlewares/rate-limit.middleware");

app.use(defaultLimiter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", routes);

const errorMiddleware = require("./src/middlewares/error.middleware");

app.use(errorMiddleware);

module.exports = app;

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
