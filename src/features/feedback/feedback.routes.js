const express = require("express");
const {
  createFeedback,
  editFeedback,
  deleteFeedback,
  getUserFeedbacks,
  getProductFeedbacks,
} = require("./feedback.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const router = express.Router();

const {
  createFeedbackSchema,
  deleteFeedbackSchema,
  editFeedbackSchema,
  getProductFeedbacksSchema,
} = require("./feedback.validation");
const { feedbackLimiter } = require("../../middlewares/rate-limit.middleware");

/**
 * @openapi
 * /user/feedbacks:
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
router.get("/user/feedbacks", authMiddleware, getUserFeedbacks);

/**
 * @openapi
 * /product/feedbacks/{code}:
 *   get:
 *     tags: [Feedback]
 *     summary: Get product feedbacks with pagination and statistics
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved product feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                         name:
 *                           type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         averageRating:
 *                           type: number
 *                           format: float
 *                         totalFeedbacks:
 *                           type: integer
 *                         ratingDistribution:
 *                           type: object
 *                           properties:
 *                             1:
 *                               type: integer
 *                             2:
 *                               type: integer
 *                             3:
 *                               type: integer
 *                             4:
 *                               type: integer
 *                             5:
 *                               type: integer
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *                     feedbacks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                           rating:
 *                             type: integer
 *                             minimum: 1
 *                             maximum: 5
 *                           comment:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/product/feedbacks/:code",
  validate(getProductFeedbacksSchema),
  getProductFeedbacks,
);

/**
 * @openapi
 * /feedback/{code}:
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
router.post(
  "/feedback/:code",
  authMiddleware,
  feedbackLimiter,
  validate(createFeedbackSchema),
  createFeedback,
);

/**
 * @openapi
 * /feedback/{id}:
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
router.put(
  "/feedback/:id",
  authMiddleware,
  validate(editFeedbackSchema),
  editFeedback,
);

/**
 * @openapi
 * /feedback/{id}:
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
router.delete(
  "/feedback/:id",
  authMiddleware,
  validate(deleteFeedbackSchema),
  deleteFeedback,
);

module.exports = router;
