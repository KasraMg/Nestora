const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  createTicket,
  getUserTickets,
  addMessageToTicket,
  toggleTicketStatus,
} = require("../controllers/ticket.controller");

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
router.post("/tickets", authMiddleware, createTicket);

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
 *     tags: [Ticket]
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
router.post("/tickets/:id/messages", authMiddleware, addMessageToTicket);

/**
 * @openapi
 * /tickets/{id}/status:
 *   put:
 *     tags: [Ticket]
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
router.put("/tickets/:id/status", authMiddleware, toggleTicketStatus);

module.exports = router;
