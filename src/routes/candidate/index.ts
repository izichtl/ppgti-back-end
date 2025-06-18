import express from 'express';
import { candidateData } from '../../controllers/candidate';
import { candidateAcademicUpdater } from '../../controllers/candidate-academic-data';
import { candidateUpdater } from '../../controllers/cadidate-personal-data';

const router = express.Router();
// TODO atualiza as infos das rotas para swagger

/**
 * @swagger
 * /v1/candidate:
 *   get:
 *     summary: Dados do candidato
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados do candidato
 */
router.get('/v1/candidate', candidateData);

/**
 * @swagger
 * /v1/candidate/update:
 *   get:
 *     summary: Dados atualizados do candidado
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.post('/v1/candidate/personal-data', candidateUpdater);
/**
 * @swagger
 * /v1/candidate/update:
 *   get:
 *     summary: Dados atualizados do candidado
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.post('/v1/candidate/academic-data', candidateAcademicUpdater);

export default router;
