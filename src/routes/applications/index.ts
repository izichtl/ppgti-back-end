

import express from 'express';
import { getApplicationsByProcess } from '../../controllers/get-applications-by-process-id';

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

export default router;
