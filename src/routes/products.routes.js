const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/products.controller");
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
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: دریافت لیست تمام محصولات
 *     responses:
 *       200:
 *         description: موفقیت آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 */
router.get("/products", getProducts);

/**
 * @openapi
 * /products/{code}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by code
 *     description: دریافت جزئیات یک محصول با استفاده از کد
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: کد محصول
 *         example: "PRD-001"
 *     responses:
 *       200:
 *         description: موفقیت آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       404:
 *         description: محصول یافت نشد
 */
router.get("/products/:code", getProduct);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create new product
 *     description: ایجاد محصول جدید با قابلیت آپلود چند تصویر
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - code
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام محصول
 *                 example: "محصول نمونه"
 *               price:
 *                 type: number
 *                 description: قیمت محصول
 *                 example: 250000
 *               priceWithoutOff:
 *                 type: number
 *                 description: قیمت بدون تخفیف
 *                 example: 300000
 *               star:
 *                 type: number
 *                 description: امتیاز محصول (0-5)
 *                 example: 4.5
 *               off:
 *                 type: number
 *                 description: درصد تخفیف
 *                 example: 10
 *               code:
 *                 type: string
 *                 description: کد یکتای محصول
 *                 example: "PRD-001"
 *               category:
 *                 type: string
 *                 description: دسته‌بندی محصول
 *                 example: "electronics"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: تصاویر محصول (چند فایل)
 *     responses:
 *       201:
 *         description: محصول با موفقیت ایجاد شد
 *       400:
 *         description: خطا
 */
router.post(
  "/products",
  upload.array("images", 10),
  handleMulterError,
  createProduct,
);
/**
 * @openapi
 * /products/{code}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product by code
 *     description: حذف یک محصول با استفاده از کد
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: کد محصول
 *         example: "PRD-001"
 *     responses:
 *       200:
 *         description: محصول با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کالا با موفقیت حذف شد"
 *                 product:
 *                   type: object
 *       404:
 *         description: محصول یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.delete("/products/:code", deleteProduct);

module.exports = router;
