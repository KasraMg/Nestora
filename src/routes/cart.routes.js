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
 * /cart:
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
router.post("/cart", authMiddleware, addToCart);
/**
 * @openapi
 * /cart:
 *   put:
 *     tags: [Cart]
 *     summary: edit product  
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
 *         description: Product edited successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/cart", authMiddleware, updateCartItemQuantity);

/**
 * @openapi
 * /cart/{itemId}:
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
router.delete("/cart/:id", authMiddleware, removeFromCart);

/**
 * @openapi
 * /cart:
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
router.get("/cart", authMiddleware, getUserCart);

/**
 * @openapi
 * /cart/rest:
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
router.delete("/cart", authMiddleware, resetUserCart);

module.exports = router;
