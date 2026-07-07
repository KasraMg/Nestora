const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../../middlewares/upload.middleware");
const multer = require("multer");  

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


const {
  createCategory,
  deleteCategory,
  getCategories,
} = require("./category.controller");

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/categories",
  uploadMiddleware.single("image"),   
  handleMulterError,
  createCategory
);

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