require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const swaggerSpec = require('./swagger');
const swaggerUi = require("swagger-ui-express");

const app = express();

connectDB();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); // 
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api", require("./src/routes/products.routes"));
app.use("/api", require("./src/routes/banner.routes"));
app.use("/api", require("./src/routes/categories.routes"));
app.use("/api", require("./src/routes/articles.routes"));
app.use("/api", require("./src/routes/landing.routes"));
app.use("/api", require("./src/routes/cart.routes"));
app.use("/api", require("./src/routes/wishlist.routes"));
app.use("/api", require("./src/routes/feedback.routes"));

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});