const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/banner.controller");

const upload = require("../middlewares/upload");
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
 *               - position
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               position:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router.post(
  "/banner",
  upload.single("image"),   
  handleMulterError,
  createBanner
);


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