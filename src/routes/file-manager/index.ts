import express from 'express';
import { fileUploader } from '../../controllers/file-manager';
import { uploaderMiddleware } from '../../middlewares/mutter-uploader';
import { fileServer } from '../../controllers/file-server';
import { candidateFilerList } from '../../controllers/file-lister';
// import { candidateRegister } from '../../controllers/candidate-register';

const router = express.Router();

/**
 * @swagger
 * /v1/file-manager/upload:
 *   post:
 *     summary: Realiza o upload de documentos
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/v1/file-manager/upload', uploaderMiddleware, fileUploader);
/**
 * @swagger
 * /v1/file-manager/pdf/:filename:
 *   post:
 *     summary: Serve o documento selecionado
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.get('/v1/file-manager/pdf/:filename', fileServer);
/**
 * @swagger
 * /v1/file-manager/pdf/list:
 *   post:
 *     summary: Lista os comprovantes do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.get('/v1/file-manager/list/candidate', candidateFilerList);

export default router;
