const express = require("express");
const { getLandingData } = require("../controllers/landing.controller");
const router = express.Router();

/**
 * @openapi
 * /landing:
 *   get:
 *     tags: [Landing]
 *     summary: Get landing page data
 *     responses:
 *       200:
 *         description: Successfully retrieved landing data
 */
router.get("/landing", getLandingData);

module.exports = router;
