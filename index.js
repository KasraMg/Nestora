require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api", require("./src/routes/products.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
