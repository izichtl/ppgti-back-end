import express from 'express';
import {
  createSelectionProcess,
  getSelectionProcesses,
  getSelectionProcessById,
  updateSelectionProcess,
  deleteSelectionProcess,
} from '../../controllers/selection-processes';
import { committeeAuthMiddleware } from '../../middlewares/auth/committee';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SelectionProcess:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the selection process
 *         name:
 *           type: string
 *           description: Name of the selection process
 *         program:
 *           type: string
 *           description: Program name (e.g., "Mestrado", "Doutorado")
 *         year:
 *           type: string
 *           description: Year of the selection process
 *         semester:
 *           type: string
 *           description: Semester of the selection process
 *         edital_link:
 *           type: string
 *           format: uri
 *           description: Link to the official edital document
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the application period
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the application period
 *     CreateSelectionProcess:
 *       type: object
 *       required:
 *         - name
 *         - program
 *         - year
 *         - semester
 *         - start_date
 *         - end_date
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the selection process
 *           example: "Processo Seletivo PPGTI 2024/1"
 *         program:
 *           type: string
 *           description: Program name
 *           example: "Mestrado"
 *         year:
 *           type: string
 *           description: Year of the selection process
 *           example: "2024"
 *         semester:
 *           type: string
 *           description: Semester of the selection process
 *           example: "1"
 *         edital_link:
 *           type: string
 *           format: uri
 *           description: Link to the official edital document
 *           example: "https://example.com/edital.pdf"
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the application period
 *           example: "2024-01-15"
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the application period
 *           example: "2024-02-15"
 */

/**
 * @swagger
 * /v1/selection-processes:
 *   post:
 *     summary: Create a new selection process
 *     description: Creates a new selection process. Only committee members can perform this action.
 *     tags:
 *       - Selection Processes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSelectionProcess'
 *     responses:
 *       201:
 *         description: Selection process created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selection process created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SelectionProcess'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "End date must be after start date"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post(
  '/v1/selection-processes',
  committeeAuthMiddleware,
  createSelectionProcess
);

/**
 * @swagger
 * /v1/selection-processes:
 *   get:
 *     summary: Get all selection processes
 *     description: Retrieves a list of all selection processes
 *     tags:
 *       - Selection Processes
 *     responses:
 *       200:
 *         description: Selection processes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selection processes retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SelectionProcess'
 *                 total_count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
 */
router.get('/v1/selection-processes', getSelectionProcesses);

/**
 * @swagger
 * /v1/selection-processes/{id}:
 *   get:
 *     summary: Get a selection process by ID
 *     description: Retrieves a specific selection process by its ID
 *     tags:
 *       - Selection Processes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selection process ID
 *     responses:
 *       200:
 *         description: Selection process retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selection process retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SelectionProcess'
 *       404:
 *         description: Selection process not found
 *       500:
 *         description: Internal server error
 */
router.get('/v1/selection-processes/:id', getSelectionProcessById);

/**
 * @swagger
 * /v1/selection-processes/{id}:
 *   put:
 *     summary: Update a selection process
 *     description: Updates an existing selection process. Only committee members can perform this action.
 *     tags:
 *       - Selection Processes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selection process ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the selection process
 *               program:
 *                 type: string
 *                 description: Program name
 *               year:
 *                 type: string
 *                 description: Year of the selection process
 *               semester:
 *                 type: string
 *                 description: Semester of the selection process
 *               edital_link:
 *                 type: string
 *                 format: uri
 *                 description: Link to the official edital document
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the application period
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the application period
 *     responses:
 *       200:
 *         description: Selection process updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selection process updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SelectionProcess'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Selection process not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/v1/selection-processes/:id',
  committeeAuthMiddleware,
  updateSelectionProcess
);

/**
 * @swagger
 * /v1/selection-processes/{id}:
 *   delete:
 *     summary: Delete a selection process
 *     description: Deletes a selection process. Only committee members can perform this action. Cannot delete if there are existing applications.
 *     tags:
 *       - Selection Processes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selection process ID
 *     responses:
 *       200:
 *         description: Selection process deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selection process deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Selection process not found
 *       409:
 *         description: Cannot delete selection process with existing applications
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/v1/selection-processes/:id',
  committeeAuthMiddleware,
  deleteSelectionProcess
);

export default router;
