const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/banner.controller");

router.post(
  "/banner",
  /*  #swagger.tags = ['Banners']
      #swagger.summary = 'Create new banner'
  */ createBanner,
);
router.get(
  "/banners",
  /*  #swagger.tags = ['Banners']
      #swagger.summary = 'Get all Banners'
  */ getBanners,
);
router.delete(
  "/banner/:id",
  /*  #swagger.tags = ['Banners'] 
      #swagger.summary = 'Delete product by id'
      #swagger.parameters['id'] = {
          in: 'path',
          description: 'Product id',
          required: true,
          type: 'number'
      }
  */ deleteBanner,
);

module.exports = router;
