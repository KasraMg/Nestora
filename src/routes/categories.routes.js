const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categories.controller");

router.get(
  "/categories",
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Get all categories'
  */
  getCategories
);

router.post(
  "/categories",
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Create new category'
  */
  createCategory
);

router.delete(
  "/categories/:slug",
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Delete category by slug'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Category slug',
          required: true,
          type: 'string'
      }
  */
  deleteCategory
);

module.exports = router;