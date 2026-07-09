const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { createOrder, getOrder, getOrders } = require("./order.controller");
const { createOrderSchema } = require("./order.validation");
const { orderLimiter } = require("../../middlewares/rate-limit.middleware");

/**
 * @openapi
 * /order:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order
 *     description: Create order with user information and cart items
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - information
 *             properties:
 *               information:
 *                 type: object
 *                 required:
 *                   - postalCode
 *                   - address
 *                   - city
 *                   - province
 *                   - firstName
 *                   - lastName
 *                 properties:
 *                   postalCode:
 *                     type: string
 *                     pattern: ^\d{10}$
 *                     example: "1234567890"
 *                     description: 10-digit postal code
 *                   address:
 *                     type: string
 *                     minLength: 10
 *                     example: "تهران، خیابان آزادی، پلاک ۱۲"
 *                     description: Full address
 *                   city:
 *                     type: object
 *                     required:
 *                       - cityId
 *                       - cityName
 *                       - provinceId
 *                     properties:
 *                       cityId:
 *                         type: string
 *                         example: "1"
 *                       cityName:
 *                         type: string
 *                         example: "تهران"
 *                       provinceId:
 *                         type: string
 *                         example: "1"
 *                   province:
 *                     type: object
 *                     required:
 *                       - provinceId
 *                       - provinceName
 *                     properties:
 *                       provinceId:
 *                         type: string
 *                         example: "1"
 *                       provinceName:
 *                         type: string
 *                         example: "تهران"
 *                   firstName:
 *                     type: string
 *                     minLength: 3
 *                     example: "علی"
 *                     description: User first name
 *                   lastName:
 *                     type: string
 *                     minLength: 3
 *                     example: "محمدی"
 *                     description: User last name
 *                   method:
 *                     type: string
 *                     example: "تیپاکس | پست | مراجعه حضوری"
 *                     description: delivery method
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "سفارش با موفقیت ایجاد شد"
 *       400:
 *         description: Bad request - user cart is empty or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "سبد خرید کاربر خالی است"
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.post(
  "/order",
  authMiddleware,
  orderLimiter,
  validate(createOrderSchema),
  createOrder,
);

/**
 * @openapi
 * /order/{trackingCode}:
 *   get:
 *     tags: [Order]
 *     summary: Get order by tracking code
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *         description: order trackingCode
 *     responses:
 *       200:
 *         description: order retrieved successfully
 *       404:
 *         description: order not found
 */
router.get("/order/:trackingCode", authMiddleware, getOrder);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Order]
 *     summary: Get order by tracking code
 *     responses:
 *       200:
 *         description: order retrieved successfully
 *       404:
 *         description: order not found
 */
router.get("/orders", authMiddleware, getOrders);
module.exports = router;
