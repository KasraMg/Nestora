const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/banner.controller");

router.post("/banner", createBanner);
router.get("/banners", getBanners);
router.delete("/banner/:id", deleteBanner);

module.exports = router;
