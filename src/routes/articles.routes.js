const express = require("express");
const router = express.Router();
const { createArticle, getArticle, deleteArticle, getArticles, editArticle } = require("../controllers/articles.controller");

/**
 * @openapi
 * /article:
 *   post:
 *     tags: [Articles]
 *     summary: Create article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article created successfully
 */
router.post("/article", createArticle);

/**
 * @openapi
 * /articles/{slug}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get("/articles/:slug", getArticle);

/**
 * @openapi
 * /articles/{slug}:
 *   put:
 *     tags: [Articles]
 *     summary: Edit article by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put("/articles/:slug", editArticle);

/**
 * @openapi
 * /articles:
 *   get:
 *     tags: [Articles]
 *     summary: Get all articles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 */
router.get("/articles", getArticles);

/**
 * @openapi
 * /articles/{slug}:
 *   delete:
 *     tags: [Articles]
 *     summary: Delete article by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */
router.delete("/articles/:slug", deleteArticle);

module.exports = router;