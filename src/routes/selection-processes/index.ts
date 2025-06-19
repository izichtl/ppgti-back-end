import express from 'express';
import {
  deleteSelectionProcessController,
} from '../../controllers/delete-selection-process';
import { committeeAuthMiddleware } from '../../middlewares/auth';
import { getSelectionProcesses } from '../../controllers/get-selection-processes';
import { createSelectionProcessController } from '../../controllers/create-selection-process';
import { getSelectionProcessByIdController } from '../../controllers/get-selection-process-by-id';
import { updateSelectionProcessController } from '../../controllers/update-selection-process';

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
 *         title:
 *           type: string
 *           description: Title of the selection process
 *         description:
 *           type: string
 *           description: Detailed description of the selection process
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the selection process
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the selection process
 *         application_deadline:
 *           type: string
 *           format: date
 *           description: Application deadline date
 *         result_date:
 *           type: string
 *           format: date
 *           description: Date when results will be announced
 *         documents_required:
 *           type: array
 *           items:
 *             type: string
 *           description: List of required documents
 *         evaluation_criteria:
 *           type: string
 *           description: Evaluation criteria for the selection process
 *         contact_info:
 *           type: string
 *           description: Contact information for inquiries
 *         status:
 *           type: string
 *           enum: [draft, published, closed]
 *           description: Current status of the selection process
 *         program:
 *           type: string
 *           description: Program name (e.g., "Mestrado", "Doutorado")
 *         year:
 *           type: string
 *           description: Year of the selection process
 *         semester:
 *           type: string
 *           description: Semester of the selection process
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateSelectionProcess:
 *       type: object
 *       required:
 *         - title
 *         - start_date
 *         - end_date
 *         - application_deadline
 *         - result_date
 *         - program
 *         - year
 *         - semester
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the selection process
 *           example: "Processo Seletivo PPGTI 2024/1"
 *         description:
 *           type: string
 *           description: Detailed description of the selection process
 *           example: "Processo seletivo para o Programa de Pós-Graduação em Tecnologia da Informação"
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the selection process
 *           example: "2024-01-15"
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the selection process
 *           example: "2024-03-15"
 *         application_deadline:
 *           type: string
 *           format: date
 *           description: Application deadline date
 *           example: "2024-02-15"
 *         result_date:
 *           type: string
 *           format: date
 *           description: Date when results will be announced
 *           example: "2024-03-01"
 *         documents_required:
 *           type: array
 *           items:
 *             type: string
 *           description: List of required documents
 *           example: ["Diploma", "Histórico acadêmico", "Comprovante de residência"]
 *         evaluation_criteria:
 *           type: string
 *           description: Evaluation criteria for the selection process
 *           example: "Análise de currículo (40%), prova escrita (40%), entrevista (20%)"
 *         contact_info:
 *           type: string
 *           description: Contact information for inquiries
 *           example: "ppgti@ifes.edu.br | (27) 3357-7500"
 *         status:
 *           type: string
 *           enum: [draft, published, closed]
 *           description: Current status of the selection process
 *           example: "draft"
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
  createSelectionProcessController
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
router.get('/v1/selection-processes/:id', getSelectionProcessByIdController);

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
 *               title:
 *                 type: string
 *                 description: Title of the selection process
 *               description:
 *                 type: string
 *                 description: Detailed description of the selection process
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the selection process
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the selection process
 *               application_deadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline date
 *               result_date:
 *                 type: string
 *                 format: date
 *                 description: Date when results will be announced
 *               documents_required:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of required documents
 *               evaluation_criteria:
 *                 type: string
 *                 description: Evaluation criteria for the selection process
 *               contact_info:
 *                 type: string
 *                 description: Contact information for inquiries
 *               status:
 *                 type: string
 *                 enum: [draft, published, closed]
 *                 description: Current status of the selection process
 *               program:
 *                 type: string
 *                 description: Program name
 *               year:
 *                 type: string
 *                 description: Year of the selection process
 *               semester:
 *                 type: string
 *                 description: Semester of the selection process
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
  updateSelectionProcessController
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
  deleteSelectionProcessController
);

// /**
//  * @swagger
//  * /v1/selection-processes/{id}:
//  */
// router.delete(
//   '/v1/selection-processes/:id',
//   committeeAuthMiddleware,
//   deleteSelectionProcessController
// );

export default router;
