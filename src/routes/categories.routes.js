const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categories.controller");

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 */
router.get("/categories", getCategories);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 */
router.post("/categories", createCategory);

/**
 * @openapi
 * /categories/{slug}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/categories/:slug", deleteCategory);

module.exports = router;