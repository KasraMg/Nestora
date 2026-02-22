const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/products.controller");
 
router.get(
  "/products",
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Get all products'
  */
  getProducts
);
 
router.get(
  "/products/:code",
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Get product by code'
      #swagger.parameters['code'] = {
          in: 'path',
          description: 'Product code',
          required: true,
          type: 'number'
      }
  */
  getProduct
);
 
router.post(
  "/products",
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Create new product'
  */
  createProduct
);
 
router.delete(
  "/products/:code",
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Delete product by code'
      #swagger.parameters['code'] = {
          in: 'path',
          description: 'Product code',
          required: true,
          type: 'number'
      }
  */
  deleteProduct
);

module.exports = router;