import express from 'express';
import { candidateLogin } from '../../controllers/auth/index';
import { candidateRegister } from '../../controllers/candidate-register';

const router = express.Router();

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Realiza o login do candidato
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
router.post('/v1/auth/login', candidateLogin);
/**
 * @swagger
 * /v1/auth/register:
 *   get:
 *     summary: Registra um novo candidato
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Registro realizado com sucesso
 */
router.post('/v1/auth/register', candidateRegister);

export default router;
