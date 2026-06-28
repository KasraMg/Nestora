require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const connectDB = require("./src/config/db");
const swaggerSpec = require('./swagger');
const swaggerUi = require("swagger-ui-express");

const app = express();

connectDB();



const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); // 

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", require("./src/routes/auth.routes"));
app.use("/api", require("./src/routes/products.routes"));
app.use("/api", require("./src/routes/banner.routes"));
app.use("/api", require("./src/routes/categories.routes"));
app.use("/api", require("./src/routes/articles.routes"));
app.use("/api", require("./src/routes/landing.routes"));
app.use("/api", require("./src/routes/cart.routes"));
app.use("/api", require("./src/routes/wishlist.routes"));
app.use("/api", require("./src/routes/feedback.routes"));
app.use("/api", require("./src/routes/public.routes"));

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});