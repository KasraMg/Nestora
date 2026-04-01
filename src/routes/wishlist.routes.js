const express = require("express");
const router = express.Router();
const { getUserWishlist, toggleWishlist } = require("../controllers/wishlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/getUserWishlist",
  /*  #swagger.tags = ['Wishlist']
      #swagger.summary = 'get user Products from wishlist'
         #swagger.security = [{
            "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Bearer token',
            required: true,
            type: 'string'
      }
  */
  authMiddleware,
  getUserWishlist,
);
router.post(
  "/toggleWishlist/:code",
  /*  #swagger.tags = ['Wishlist']
      #swagger.summary = 'add & remove Products at user wishlist'
         #swagger.security = [{
            "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Bearer token',
            required: true,
            type: 'string'
      }
  */
  authMiddleware,
  toggleWishlist,
);

module.exports = router;
