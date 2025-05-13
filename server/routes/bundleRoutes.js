const express = require("express")
const router = express.Router()
const {
  getBundles,
  getBundleById,
  createBundle,
  updateBundle,
  deleteBundle,
  checkBundleDiscount,
} = require("../controllers/bundleController")
const { protect, seller } = require("../middleware/authMiddleware")

/**
 * @swagger
 * /api/bundles:
 *   get:
 *     summary: Get all bundles
 *     description: Retrieve a list of all bundles with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, draft]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: A list of bundles
 */
router.get("/", getBundles)

/**
 * @swagger
 * /api/bundles/{id}:
 *   get:
 *     summary: Get a specific bundle
 *     description: Retrieve a specific bundle by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bundle ID
 *     responses:
 *       200:
 *         description: A bundle object
 *       404:
 *         description: Bundle not found
 */
router.get("/:id", getBundleById)

/**
 * @swagger
 * /api/bundles:
 *   post:
 *     summary: Create a new bundle
 *     description: Create a new product bundle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - products
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               status:
 *                 type: string
 *                 enum: [active, draft]
 *     responses:
 *       201:
 *         description: Created bundle
 *       400:
 *         description: Invalid input
 */
router.post("/", protect, seller, createBundle)

/**
 * @swagger
 * /api/bundles/{id}:
 *   patch:
 *     summary: Update a bundle
 *     description: Update an existing bundle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bundle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated bundle
 *       404:
 *         description: Bundle not found
 */
router.patch("/:id", protect, seller, updateBundle)

/**
 * @swagger
 * /api/bundles/{id}:
 *   delete:
 *     summary: Delete a bundle
 *     description: Delete a specific bundle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bundle ID
 *     responses:
 *       200:
 *         description: Bundle deleted
 *       404:
 *         description: Bundle not found
 */
router.delete("/:id", protect, seller, deleteBundle)

/**
 * @swagger
 * /api/bundles/{id}/checkDiscount:
 *   get:
 *     summary: Check bundle discount
 *     description: Validate bundle discount and return discounted price
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bundle ID
 *     responses:
 *       200:
 *         description: Discount information
 *       404:
 *         description: Bundle not found
 */
router.get("/:id/checkDiscount", checkBundleDiscount)

module.exports = router
