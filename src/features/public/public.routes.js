const express = require("express");
const { getShopFilters, getLocations } = require("./public.controller");
const router = express.Router();
const mongoose = require("mongoose");
const redisClient = require("../../config/redis");

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
 *         description: Successfully retrieved locations
 */
router.get("/locations", getLocations);

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Public]
 *     summary: Check API health status
 *     responses:
 *       200:
 *         description: API health status
 */
router.get("/health", async (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const redisStatus = redisClient.isOpen ? "connected" : "disconnected";

  const status =
    mongoStatus === "connected" && redisStatus === "connected"
      ? "ok"
      : "warning";

  res.json({
    status,
    uptime: process.uptime(),
    services: {
      mongo: mongoStatus,
      redis: redisStatus,
    },
    timestamp: new Date(),
  });
});

module.exports = router;
