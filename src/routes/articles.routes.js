const express = require("express");
const router = express.Router();
const {
  createArticle,
  getArticle,
  deleteArticle,
  getArticles,
  editArticle,
} = require("../controllers/articles.controller");

const upload = require("../middlewares/upload");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res
        .status(400)
        .json({ message: "حجم فایل بیشتر از 5 مگابایت است" });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

/**
 * @openapi
 * /articles:
 *   post:
 *     tags: [Articles]
 *     summary: Create article
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - short_description
 *               - body
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               short_description:
 *                 type: string
 *               body:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Article created successfully
 */
router.post(
  "/articles",
  authMiddleware,
  upload.single("image"),
  handleMulterError,
  createArticle,
);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               short_description:
 *                 type: string
 *               body:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put(
  "/articles/:slug",
  authMiddleware,
  upload.single("image"),
  handleMulterError,
  editArticle,
);

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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
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
router.delete("/articles/:slug", authMiddleware, deleteArticle);

module.exports = router;
