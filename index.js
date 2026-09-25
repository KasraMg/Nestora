require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const redisClient = require("./src/config/redis");
const swaggerSpec = require("./swagger");
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

const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

app.use("/api-docs", express.static(swaggerUiPath));

// vercel config
app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Homano API Documentation</title>

        <link
          rel="stylesheet"
          href="/api-docs/swagger-ui.css"
        />
      </head>

      <body>
        <div id="swagger-ui"></div>

        <script src="/api-docs/swagger-ui-bundle.js"></script>
        <script src="/api-docs/swagger-ui-standalone-preset.js"></script>

        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerSpec)},
              dom_id: "#swagger-ui",
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
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