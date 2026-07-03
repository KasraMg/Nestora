const express = require("express");
const {
  getShopFilters,
  getLocations,
} = require("../controllers/public.controller");
const router = express.Router();
/**
 * @openapi
 * /shopFilters:
 *   get:
 *     tags: [Filters]
 *     summary: Get shop filters
 *     responses:
 *       200:
 *         description: Successfully retrieved filters
 */
router.get("/shopFilters", getShopFilters);
/**
 * @openapi
 * /locations:
 *   get:
 *     tags: [Public]
 *     summary: Get locations
 *     responses:
 *       200:
 *         description: Successfully retrieved locaations
 */
router.get("/locations", getLocations);

module.exports = router;
