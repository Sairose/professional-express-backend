
import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { paginationSchema } from "../schemas/pagination.schema.js";
import { userIdSchema } from "../schemas/user-id.schema.js";
import { validateParams } from "../middleware/validate-params.js";
import { validateQuery } from "../middleware/validate-query.js";
import { updateUserSchema } from "../schemas/update-user.schema.js";
import { validateRequest } from "../middleware/validate-request.js";

const userRouter = Router();

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes an existing user using their MongoDB ObjectId.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: A valid 24-character MongoDB ObjectId.
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       "204":
 *         description: User deleted successfully. No response body.
 *       "400":
 *         description: Invalid MongoDB ObjectId.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete(
  "/:id",
  validateParams(userIdSchema),
  deleteUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Updates one or more fields of an existing user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: A valid 24-character MongoDB ObjectId.
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 example: 25
 *     responses:
 *       "200":
 *         description: User updated successfully.
 *         content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       "400":
 *         description: Invalid ID or request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "409":
 *         description: Email address already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.patch(
  "/:id",
  validateParams(userIdSchema),
  validateRequest(updateUserSchema),
  updateUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the user
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       "200":
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       "400":
 *         description: Invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get(
  "/:id",
  validateParams(userIdSchema),
  getUserById,
);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retrieve users
 *     description: Retrieves a paginated list of users.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number to retrieve.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page.
 *     responses:
 *       "200":
 *         description: Users retrieved successfully.
 *       "400":
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get(
  "/",
  validateQuery(paginationSchema),
  getUsers,
);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a user with a name, email address, and age.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       "201":
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       "400":
 *         description: Invalid request body or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "409":
 *         description: A user with this email address already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post(
  "/",
  createUser,
);

export default userRouter;
