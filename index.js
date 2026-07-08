require("dotenv").config();
const env = require("./src/config/env");
const express = require("express");
const path = require("path");
const fs = require("fs");
const connectDB = require("./src/config/db");
const swaggerSpec = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const routes = require("./src/routes");
const redisClient = require("./src/config/redis");

const app = express();

(async () => {
  await connectDB();

  redisClient.connect().catch((err) => {
    console.warn("⚠️ Redis unavailable:", err.message);
  });
})();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
