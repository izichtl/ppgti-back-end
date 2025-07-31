

import express from 'express';
import { getApplicationsByProcess } from '../../controllers/get-applications-by-process-id';
import { getApplicationById } from '../../controllers/get-applications-by-id';
import { aplicationRegister } from '../../controllers/create-candidate-aplication';
import { uploaderMiddleware } from '../../middlewares/mutter-uploader';
import { homologApplication } from '../../controllers/create-homolog-aplication';

const router = express.Router();
// TODO atualiza as infos das rotas para swagger

/**
 * @swagger
 * /v1/applications:
 *   get:
 *     summary: Aplicações por processo seletivo
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.get('/v1/applications', getApplicationsByProcess);

/**
 * @swagger
 * /v1/applications:
 *   get:
 *     summary: Aplicações por processo seletivo
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.get('/v1/applications/candidate', getApplicationById);

/**
 * @swagger
 * /v1/applications:
 *   get:
 *     summary: Cadastra uma nova aplicação
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.post('/v1/applications/register', uploaderMiddleware, aplicationRegister);

/**
 * @swagger
 * /v1/applications:
 *   get:
 *     summary: Cadastra uma nova aplicação
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.post('/v1/applications/homolog', homologApplication);

export default router;
