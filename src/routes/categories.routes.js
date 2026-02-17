const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categories.controller");

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:slug", deleteCategory);

module.exports = router;
