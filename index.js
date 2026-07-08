require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./src/config/db");
const swaggerSpec = require("./swagger");
const swaggerUi = require("swagger-ui-express");

const app = express();

connectDB();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //

const { defaultLimiter } = require("./src/middlewares/rate-limit.middleware");
app.use(defaultLimiter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", require("./src/features/auth/auth.routes"));
app.use("/api", require("./src/features/user/user.routes"));
app.use("/api", require("./src/features/product/products.routes"));
app.use("/api", require("./src/features/banner/banner.routes"));
app.use("/api", require("./src/features/category/category.routes"));
app.use("/api", require("./src/features/article/article.routes"));
app.use("/api", require("./src/features/landing/landing.routes"));
app.use("/api", require("./src/features/cart/cart.routes"));
app.use("/api", require("./src/features/wishlist/wishlist.routes"));
app.use("/api", require("./src/features/feedback/feedback.routes"));
app.use("/api", require("./src/features/order/order.routes"));
app.use("/api", require("./src/features/ticket/ticket.routes"));
app.use("/api", require("./src/features/public/public.routes"));

const errorMiddleware = require("./src/middlewares/error.middleware");
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});
