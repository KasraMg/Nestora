const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("./products.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const uploadMiddleware = require("../../middlewares/upload.middleware");

const multer = require("multer");
const { createProductSchema, updateProductSchema } = require("./product.validation");

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

const parseComplexFormData = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next();
  }

  const result = { ...req.body };

  const arrayFields = ["colors", "details"];
  for (const field of arrayFields) {
    if (req.body[field]) {
      if (typeof req.body[field] === "string") {
        const trimmed = req.body[field].trim();
        if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
          try {
            result[field] = JSON.parse(trimmed);
          } catch (e) {
            console.log(`❌ ${field} parse error:`, e.message);
          }
        }
      }
    }
  }

  req.body = result;
  next();
};

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: دریافت لیست محصولات با فیلترها و صفحه‌بندی
 *     description: این endpoint لیست محصولات را با امکان فیلتر بر اساس دسته‌بندی، جستجو، محدوده قیمت، رنگ و مرتب‌سازی برمی‌گرداند.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - price
 *             - -price
 *             - createdAt
 *             - -createdAt
 *             - star
 *             - -star
 *
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفقیت‌آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 45
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: پارامترهای نامعتبر
 *       500:
 *         description: خطای سرور
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
router.get("/product/:code", getProduct);

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create new product
 *     description: ایجاد محصول جدید با قابلیت آپلود چند تصویر
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - code
 *               - category
 *               - description
 *               - price
 *               - priceWithoutOff
 *               - images
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: "لوستر مدرن"
 *
 *               slug:
 *                 type: string
 *                 example: "لوستر مدرن"
 *
 *               code:
 *                 type: number
 *                 example: "1"
 *
 *               category:
 *                 type: number
 *                 example: "121212"
 *                 description:  ایدی کتگوری
 *
 *               description:
 *                 type: string
 *                 example: "لوستر مدرن مناسب دکوراسیون داخلی"
 *
 *               price:
 *                 type: number
 *                 example: 3713000
 *
 *               priceWithoutOff:
 *                 type: number
 *                 example: 10676000
 *
 *               off:
 *                 type: number
 *                 example: 65
 *
 *               star:
 *                 type: number
 *                 example: 4.5
 *
 *               images:
 *                 type: array
 *                 description: تصاویر محصول (حداکثر ۱۰ عدد)
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *               colors:
 *                 type: string
 *                 description: رنگ‌ها به صورت JSON string
 *                 example: '[{"name":"مشکی","code":"#000000"},{"name":"سفید","code":"#FFFFFF"}]'
 *
 *               details:
 *                 type: string
 *                 description: مشخصات فنی به صورت JSON string
 *                 example: '[{"key":"وزن","value":"1050 گرم"},{"key":"ارتفاع","value":"100 سانتی متر"}]'
 *
 *     responses:
 *       201:
 *         description: محصول با موفقیت ایجاد شد
 *
 *       400:
 *         description: خطای اعتبارسنجی اطلاعات
 *
 *       401:
 *         description: عدم دسترسی
 */
router.post(
  "/products",
  uploadMiddleware.array("images", 10),
  parseComplexFormData,
  handleMulterError,
  validate(createProductSchema),
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
 *         example: "155"
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
router.delete("/products/:code", authMiddleware, deleteProduct);

/**
 * @openapi
 * /products/{code}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product by code
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: number
 *         example: 66
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *
 *               slug:
 *                 type: string
 *
 *               price:
 *                 type: number
 *
 *               priceWithoutOff:
 *                 type: number
 *
 *               off:
 *                 type: number
 *
 *               star:
 *                 type: number
 *
 *               category:
 *                 type: string
 *
 *               description:
 *                 type: string
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *               colors:
 *                 type: string
 *                 example: '[{"name":"مشکی","code":"#000000"}]'
 *
 *               details:
 *                 type: string
 *                 example: '[{"key":"وزن","value":"2kg"}]'
 *
 *     responses:
 *       200:
 *         description: محصول ویرایش شد
 */
router.put(
  "/products/:code",
  uploadMiddleware.array("images", 10),
  parseComplexFormData,
  handleMulterError,
  validate(updateProductSchema),
  updateProduct,
);

module.exports = router;
