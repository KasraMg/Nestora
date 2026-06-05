const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getUserCart,
  resetUserCart
} = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @openapi
 * /addToCart/{code}:
 *   post:
 *     tags: [Cart]
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/addToCart/:code", authMiddleware, addToCart);

/**
 * @openapi
 * /removeFromCart/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove product from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/removeFromCart/:productId", authMiddleware, removeFromCart);

/**
 * @openapi
 * /getProducts:
 *   get:
 *     tags: [Cart]
 *     summary: Get user products from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Successfully retrieved cart products
 *       401:
 *         description: Unauthorized
 */
router.get("/getProducts", authMiddleware, getUserCart);

/**
 * @openapi
 * /resetUserCart:
 *   delete:
 *     tags: [Cart]
 *     summary: Reset user cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Cart reset successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/resetUserCart", authMiddleware, resetUserCart);

module.exports = router;