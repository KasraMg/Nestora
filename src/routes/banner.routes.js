const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/banner.controller");

/**
 * @openapi
 * /banner:
 *   post:
 *     tags: [Banners]
 *     summary: Create new banner
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router.post("/banner", createBanner);

/**
 * @openapi
 * /banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get all banners
 *     responses:
 *       200:
 *         description: Successfully retrieved banners
 */
router.get("/banners", getBanners);

/**
 * @openapi
 * /banner/{id}:
 *   delete:
 *     tags: [Banners]
 *     summary: Delete banner by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */
router.delete("/banner/:id", deleteBanner);

module.exports = router;