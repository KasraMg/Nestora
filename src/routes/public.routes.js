const express = require("express");
const { getShopFilters } = require("../controllers/public.controller");
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
 *       401:
 *         description: Unauthorized
 */
router.get("/shopFilters", getShopFilters);


module.exports = router;