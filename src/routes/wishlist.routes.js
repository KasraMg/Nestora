const express = require("express");
const router = express.Router();
const { getUserWishlist, toggleWishlist } = require("../controllers/wishlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @openapi
 * /getUserWishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user products from wishlist
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist
 *       401:
 *         description: Unauthorized
 */
router.get("/getUserWishlist", authMiddleware, getUserWishlist);

/**
 * @openapi
 * /toggleWishlist/{code}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add & remove products from user wishlist
 *     security:
 *       - bearerAuth: []
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     responses:
 *       200:
 *         description: Successfully toggled wishlist
 *       401:
 *         description: Unauthorized
 */
router.post("/toggleWishlist/:code", authMiddleware, toggleWishlist);

module.exports = router;