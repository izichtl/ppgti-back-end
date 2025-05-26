import express from "express";
import { candidateLogin } from "../../controllers/auth/index";
import { candidateRegister } from "../../controllers/candidate-register";
import {
  comissaoLogin,
  comissaoRegister,
} from "../../controllers/auth/comissao";

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
router.post("/v1/auth/login", candidateLogin);
/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Registra um novo candidato
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
 *               cpf:
 *                 type: string
 *               social_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidato registrado com sucesso
 *       409:
 *         description: Email ou CPF já registrado
 */
router.post("/v1/auth/register", candidateRegister);

/**
 * @swagger
 * /v1/auth/comissao/login:
 *   post:
 *     summary: Realiza o login de um membro da comissão
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       404:
 *         description: Usuário da comissão não encontrado ou credenciais inválidas
 */
router.post("/v1/auth/comissao/login", comissaoLogin);

/**
 * @swagger
 * /v1/auth/comissao/register:
 *   post:
 *     summary: Registra um novo membro da comissão
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
 *               matricula:
 *                 type: string
 *               name:
 *                 type: string
 *               authorizationCode:
 *                 type: string
 *               cpf:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membro da comissão registrado com sucesso
 *       401:
 *         description: Código de autorização inválido
 *       409:
 *         description: Email, matrícula ou CPF já registrado
 *       500:
 *         description: Código de autorização da comissão não configurado
 */
router.post("/v1/auth/comissao/register", comissaoRegister);

export default router;
