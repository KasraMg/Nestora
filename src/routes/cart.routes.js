const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getUserCart,
} = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/addToCart/:code",
  /*  #swagger.tags = ['Cart']
      #swagger.summary = 'Add Product to cart'
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
  addToCart,
);
router.delete(
  "/removeFromCart/:productId",
  /*  #swagger.tags = ['Cart']
      #swagger.summary = 'Remove Product From cart'
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
  removeFromCart,
);
router.get(
  "/getProducts",
  /*  #swagger.tags = ['Cart']
      #swagger.summary = 'get user Products from cart'
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
  getUserCart,
);

module.exports = router;
