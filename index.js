require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDB = require("./src/config/db");
const redisClient = require("./src/config/redis");
const routes = require("./src/routes");
const swaggerUiDist = require("swagger-ui-dist");

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

// Swagger UI
const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

app.use("/api-docs", express.static(swaggerUiPath));

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(swaggerUiPath, "index.html"));
});

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

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
    console.log(`🔗 API base: http://localhost:${PORT}/api`);
  });
}

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
