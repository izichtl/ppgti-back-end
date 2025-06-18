import { z } from 'zod';

export const statusEnum = z.enum(['draft', 'published', 'closed']);

export const createSelectionProcessSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de início deve ser uma data válida',
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de fim deve ser uma data válida',
  }),
  application_deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Prazo de inscrição deve ser uma data válida',
  }),
  result_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data do resultado deve ser uma data válida',
  }),
  documents_required: z.array(z.string()).default([]),
  evaluation_criteria: z.string().optional(),
  contact_info: z.string().optional(),
  status: statusEnum.default('draft'),
  program: z.string().min(1, 'Programa é obrigatório'),
  year: z.string().min(4, 'Ano deve ter pelo menos 4 caracteres'),
  semester: z.string().min(1, 'Semestre é obrigatório'),
});

export const updateSelectionProcessSchema =
  createSelectionProcessSchema.partial();

export type CreateSelectionProcessPayload = z.infer<
  typeof createSelectionProcessSchema
>;
export type UpdateSelectionProcessPayload = z.infer<
  typeof updateSelectionProcessSchema
>;
