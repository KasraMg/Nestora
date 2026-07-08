const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  getMe,
  editUser,
  createAddress,
  deleteAddress,
} = require("./user.controller");

const validate = require("../../middlewares/validate.middleware");

const {
  editUserSchema,
  createAddressSchema,
  addressIdSchema,
} = require("./user.validation");

/**
 * @openapi
 * /me:
 *   get:
 *     tags: [User]
 *     summary: Get current user by token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, getMe);

/**
 * @openapi
 * /me:
 *    put:
 *     tags: [User]
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
router.put("/me", authMiddleware, validate(editUserSchema), editUser);

/**
 * @openapi
 * /address:
 *   put:
 *     tags: [User]
 *     summary: Create address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postalCode
 *               - address
 *               - city
 *               - province
 *             properties:
 *               postalCode:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "تهران، خیابان آزادی، پلاک ۱۲"
 *               city:
 *                 type: object
 *                 properties:
 *                   cityId:
 *                     type: string
 *                     example: "01"
 *                   cityName:
 *                     type: string
 *                     example: "اردبیل"
 *                   provinceId:
 *                     type: string
 *                     example: "24"
 *               province:
 *                 type: object
 *                 properties:
 *                   provinceId:
 *                     type: string
 *                     example: "24"
 *                   provinceName:
 *                     type: string
 *                     example: "اردبیل"
 *     responses:
 *       200:
 *         description: User address created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/address",
  authMiddleware,
  validate(createAddressSchema),
  createAddress,
);

/**
 * @openapi
 * /address/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete address by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: address ID
 *     responses:
 *       200:
 *         description: address deleted successfully
 *       404:
 *         description: address not found
 */
router.delete(
  "/address/:id",
  authMiddleware,
  validate(addressIdSchema),
  deleteAddress,
);
module.exports = router;
