const express = require("express");

const { getAdminStats } = require("./admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const adminMiddleware = require("../../middlewares/admin.middleware");

const router = express.Router();

/**
 * @openapi
 * /stats:
 *   get:
 *     tags: [Admin-panel]

 *     responses:
 *       200:
 *         description: stats retrieved successfully
 *       404:
 *         description: stats not found
 */
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
