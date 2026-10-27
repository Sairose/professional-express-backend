
/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: User not found
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - age
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Sairose Shrestha
 *         email:
 *           type: string
 *           format: email
 *           example: sairose@example.com
 *         age:
 *           type: integer
 *           minimum: 18
 *           maximum: 120
 *           example: 23
 *
 *     UserResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User retrieved successfully
 *         data:
 *           type: object
 *           required:
 *             - _id
 *             - name
 *             - email
 *             - age
 *             - createdAt
 *             - updatedAt
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             name:
 *               type: string
 *               example: Sairose Shrestha
 *             email:
 *               type: string
 *               format: email
 *               example: sairose@example.com
 *             age:
 *               type: integer
 *               minimum: 18
 *               maximum: 120
 *               example: 23
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2026-10-27T10:30:00.000Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2026-10-27T10:30:00.000Z"
 */
