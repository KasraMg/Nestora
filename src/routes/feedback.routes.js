const express = require("express");
const {
  createFeedback,
  editFeedback,
  deleteFeedback,
  getUserFeedbacks,
  getProductFeedbacks,
} = require("../controllers/feedback.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

/**
 * @openapi
 * /getUserFeedbacks:
 *   get:
 *     tags: [Feedback]
 *     summary: Get user feedbacks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user feedbacks
 *       401:
 *         description: Unauthorized
 */
router.get("/getUserFeedbacks", authMiddleware, getUserFeedbacks);

/**
 * @openapi
 * /getProductFeedbacks/{code}:
 *   get:
 *     tags: [Feedback]
 *     summary: Get product feedbacks
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     responses:
 *       200:
 *         description: Successfully retrieved product feedbacks
 */
router.get("/getProductFeedbacks/:code", getProductFeedbacks);

/**
 * @openapi
 * /createFeedback/{code}:
 *   post:
 *     tags: [Feedback]
 *     summary: Create feedback for product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/createFeedback/:code", authMiddleware, createFeedback);

/**
 * @openapi
 * /editFeedback/{id}:
 *   put:
 *     tags: [Feedback]
 *     summary: Edit product feedback
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Feedback not found
 */
router.put("/editFeedback/:id", authMiddleware, editFeedback);

/**
 * @openapi
 * /deleteFeedback/{id}:
 *   delete:
 *     tags: [Feedback]
 *     summary: Delete feedback
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Feedback not found
 */
router.delete("/deleteFeedback/:id", authMiddleware, deleteFeedback);

module.exports = router;