const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  editUser,
  impersonateUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

/**
 * @openapi
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @openapi
 * /getMe:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user by token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/getMe", authMiddleware, getMe);
/**
 * @openapi
 * /editUser:
 *    put:
 *     tags: [Auth]
 *     summary: Edit user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               birhDate:
 *                 type: string
 *               phone:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/editUser", authMiddleware, editUser);

/**
 * @openapi
 * /impersonate/{userId}:
 *   post:
 *     tags: [Auth]
 *     summary: Impersonate user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to impersonate
 *     responses:
 *       200:
 *         description: Impersonation successful
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/impersonate/:userId",
  authMiddleware,
  adminMiddleware,
  impersonateUser,
);

module.exports = router;
