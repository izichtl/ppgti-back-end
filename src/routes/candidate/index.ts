import express from 'express';
import { candidateUpdater } from '../../controllers/create-cadidate-personal-data/indext';
import { candidateAcademicUpdater } from '../../controllers/create-candidate-academic-data';
import { getApplicationsByCpf } from '../../controllers/get-candidate-aplications';
import { getApplicationsValidationByCpf } from '../../controllers/get-candidate-aplications-validation';
import { getCadidateByCPF } from '../../controllers/get-candidate-by-cpf';

const router = express.Router();
// TODO atualiza as infos das rotas para swagger

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
router.get('/v1/candidate/data/validation', getCadidateByCPF);

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

/**
 * @swagger
 * /v1/candidate/aplications:
 *   get:
 *     summary: Dados atualizados do candidado
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.get('/v1/candidate/aplications', getApplicationsByCpf);

/**
 * @swagger
 * /v1/candidate/aplications:
 *   get:
 *     summary: Dados atualizados do candidado
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 */
router.get('/v1/candidate/validation', getApplicationsValidationByCpf);

export default router;
