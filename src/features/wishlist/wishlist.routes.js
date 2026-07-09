const express = require("express");
const router = express.Router();
const { getUserWishlist, toggleWishlist } = require("./wishlist.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const { toggleWishlistSchema } = require("./wishlist.validation");

/**
 * @openapi
 * /wishlist:
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
router.get("/wishlist", authMiddleware, getUserWishlist);

/**
 * @openapi
 * /toggle/wishlist/{code}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add & remove products from user wishlist
 *     parameters:
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
router.post(
  "/toggle/wishlist/:code",
  authMiddleware,
  validate(toggleWishlistSchema),
  toggleWishlist,
);

module.exports = router;
