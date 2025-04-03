import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Exemplo',
    version: '1.0.0',
    description: 'Documentação da API gerada automaticamente',
  },
  servers: [
    {
      url: 'http://localhost:2711',
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const router = express.Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerSpec));

export default router;
