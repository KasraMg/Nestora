require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

connectDB();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
