const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/products.controller");

router.get("/products", getProducts);
router.get("/products/:code", getProduct);
router.post("/products", createProduct);
router.delete("/products/:code", deleteProduct);

module.exports = router;
