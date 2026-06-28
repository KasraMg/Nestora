const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getUserCart,
  resetUserCart,
  updateCartItemQuantity,
} = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @openapi
 * /addToCart:
 *   post:
 *     tags: [Cart]
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/addToCart", authMiddleware, addToCart);
/**
 * @openapi
 * /updateCartItemQuantity:
 *   post:
 *     tags: [Cart]
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               action:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/updateCartItemQuantity", authMiddleware, updateCartItemQuantity);

/**
 * @openapi
 * /removeFromCart/{itemId}:
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
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: item ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/removeFromCart/:id", authMiddleware, removeFromCart);

/**
 * @openapi
 * /getProducts:
 *   get:
 *     tags: [Cart]
 *     summary: Get user products from cart
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Cart reset successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/resetUserCart", authMiddleware, resetUserCart);

module.exports = router;
