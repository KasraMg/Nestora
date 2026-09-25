require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const swaggerSpec = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const routes = require("./src/routes");

const app = express();

app.set("trust proxy", 1);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
