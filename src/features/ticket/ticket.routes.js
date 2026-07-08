const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  createTicket,
  getUserTickets,
  addMessageToTicket,
  toggleTicketStatus,
  getTicket,
} = require("./ticket.controller");
const {
  createTicketSchema,
  addMessageSchema,
  ticketIdSchema,
} = require("./ticket.validation");
const {
  ticketLimiter,
  ticketMessageLimiter,
} = require("../../middlewares/rate-limit.middleware");

/**
 * @openapi
 * /tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a new support ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: order | site
 *               body:
 *                 type: string
 *                 example: پرداخت انجام شده اما سفارش ثبت نشده است.
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/tickets",
  authMiddleware,
  ticketLimiter,
  validate(createTicketSchema),
  createTicket,
);

/**
 * @openapi
 * /tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: Get current user's tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: لیست تیکت ها با موفقیت دریافت شد
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/tickets", authMiddleware, getUserTickets);

/**
 * @openapi
 * /tickets/{id}/messages:
 *   post:
 *     tags: [Tickets]
 *     summary: Add new message to ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 example: سلام، مشکل هنوز برطرف نشده است.
 *     responses:
 *       200:
 *         description: Message added successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.post(
  "/tickets/:id/messages",
  authMiddleware,
  ticketMessageLimiter,
  validate(addMessageSchema),
  addMessageToTicket,
);

/**
 * @openapi
 * /tickets/{id}/status:
 *   put:
 *     tags: [Tickets]
 *     summary: Toggle ticket status (open / closed)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket not found
 */
router.put(
  "/tickets/:id/status",
  authMiddleware,
  validate(ticketIdSchema),
  toggleTicketStatus,
);

/**
 * @openapi
 * /ticket/{id}:
 *   get:
 *     tags: [Tickets]
 *     summary: Delete ticket by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ticket ID
 *     responses:
 *       200:
 *         description: ticket deleted successfully
 *       404:
 *         description: ticket not found
 */
router.get("/ticket/:id", authMiddleware, validate(ticketIdSchema), getTicket);

module.exports = router;
