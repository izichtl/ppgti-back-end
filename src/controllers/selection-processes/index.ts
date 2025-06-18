// import {  } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import AppDataSource from '../../db';
import { z } from 'zod';

const statusEnum = z.enum(['draft', 'published', 'closed']);

const createSelectionProcessSchema = z.object({
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

const updateSelectionProcessSchema = createSelectionProcessSchema.partial();

export type CreateSelectionProcessProps = z.infer<
  typeof createSelectionProcessSchema
>;
export type UpdateSelectionProcessProps = z.infer<
  typeof updateSelectionProcessSchema
>;

export const createSelectionProcess = controllerWrapper(async (_req, _res) => {
  const validatedData = createSelectionProcessSchema.parse(_req.body);

  const {
    title,
    description,
    start_date,
    end_date,
    application_deadline,
    result_date,
    documents_required,
    evaluation_criteria,
    contact_info,
    status,
    program,
    year,
    semester,
  } = validatedData;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const appDeadline = new Date(application_deadline);
  const resultDate = new Date(result_date);

  if (endDate <= startDate) {
    return _res.response.invalid({
      message: 'Data de fim deve ser posterior à data de início',
      status: 400,
    });
  }

  if (appDeadline <= startDate) {
    return _res.response.invalid({
      message: 'Prazo de inscrição deve ser posterior à data de início',
      status: 400,
    });
  }

  if (resultDate <= appDeadline) {
    return _res.response.invalid({
      message: 'Data do resultado deve ser posterior ao prazo de inscrição',
      status: 400,
    });
  }

  try {
    const result = await AppDataSource.query(
      `
      INSERT INTO selection_processes (
        title, description, start_date, end_date, application_deadline, 
        result_date, documents_required, evaluation_criteria, contact_info, status, program, year, semester
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
      `,
      [
        title,
        description || null,
        start_date,
        end_date,
        application_deadline,
        result_date,
        JSON.stringify(documents_required),
        evaluation_criteria || null,
        contact_info || null,
        status,
        program,
        year,
        semester,
      ]
    );

    const processData = {
      ...result[0],
      documents_required: result[0].documents_required || [],
    };

    _res.response.success({
      status: 201,
      message: 'Processo seletivo criado com sucesso',
      data: processData,
    });
  } catch (error) {
    console.error('Erro ao criar processo seletivo:', error);
    _res.response.failure({
      message: 'Falha ao criar processo seletivo',
      status: 500,
    });
  }
});



// export const getSelectionProcessById = controllerWrapper(async (_req, _res) => {
//   console.log('@@@@@@@@@@@ ID')
//   const { id } = _req.params;

//   if (!AppDataSource.isInitialized) {
//     await AppDataSource.initialize();
//   }

//   try {
//     const process = await AppDataSource.query(
//       `
//       SELECT * FROM selection_processes
//       WHERE id = $1
//       `,
//       [id]
//     );

//     if (process.length === 0) {
//       return response.failure({
//         message: 'Processo seletivo não encontrado',
//         status: 404,
//       });
//     }

//     // Parse documents_required back to array
//     const processData = {
//       ...process[0],
//       documents_required: process[0].documents_required || [],
//     };

//     response.success({
//       status: 200,
//       message: 'Processo seletivo recuperado com sucesso',
//       data: processData,
//     });
//   } catch (error) {
//     console.error('Erro ao recuperar processo seletivo:', error);
//     response.failure({
//       message: 'Falha ao recuperar processo seletivo',
//       status: 500,
//     });
//   }
// });

export const updateSelectionProcess = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;
  const validatedData = updateSelectionProcessSchema.parse(_req.body);

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Check if process exists
  const existingProcess = await AppDataSource.query(
    `SELECT * FROM selection_processes WHERE id = $1`,
    [id]
  );

  if (existingProcess.length === 0) {
    return _res.response.failure({
      message: 'Processo seletivo não encontrado',
      status: 404,
    });
  }

  // Validate dates if provided
  if (validatedData.start_date && validatedData.end_date) {
    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);

    if (endDate <= startDate) {
      return _res.response.invalid({
        message: 'Data de fim deve ser posterior à data de início',
        status: 400,
      });
    }
  }

  // Build dynamic update query
  const updateFields = [];
  const updateValues = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(validatedData)) {
    if (value !== undefined) {
      if (key === 'documents_required') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(JSON.stringify(value));
      } else {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(value);
      }
      paramIndex++;
    }
  }

  if (updateFields.length === 0) {
    return _res.response.invalid({
      message: 'Nenhum campo para atualizar',
      status: 400,
    });
  }

  // Add updated_at field
  updateFields.push(`updated_at = $${paramIndex}`);
  updateValues.push(new Date());
  paramIndex++;

  updateValues.push(id);

  try {
    const result = await AppDataSource.query(
      `
      UPDATE selection_processes
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
      `,
      updateValues
    );

    const processData = {
      ...result[0],
      documents_required: result[0].documents_required || [],
    };

    _res.response.success({
      status: 200,
      message: 'Processo seletivo atualizado com sucesso',
      data: processData,
    });
  } catch (error) {
    console.error('Erro ao atualizar processo seletivo:', error);
    _res.response.failure({
      message: 'Falha ao atualizar processo seletivo',
      status: 500,
    });
  }
});

export const deleteSelectionProcess = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  try {
    // Check if process exists
    const existingProcess = await AppDataSource.query(
      `SELECT * FROM selection_processes WHERE id = $1`,
      [id]
    );

    if (existingProcess.length === 0) {
      return _res.response.failure({
        message: 'Processo seletivo não encontrado',
        status: 404,
      });
    }

    // Check if there are any applications for this process
    const applications = await AppDataSource.query(
      `SELECT COUNT(*) as count FROM applications WHERE process_id = $1`,
      [id]
    );

    if (parseInt(applications[0].count) > 0) {
      return _res.response.failure({
        message:
          'Não é possível excluir processo seletivo com inscrições existentes',
        status: 409,
      });
    }

    await AppDataSource.query(`DELETE FROM selection_processes WHERE id = $1`, [
      id,
    ]);

    _res.response.success({
      status: 200,
      message: 'Processo seletivo excluído com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir processo seletivo:', error);
    _res.response.failure({
      message: 'Falha ao excluir processo seletivo',
      status: 500,
    });
  }
});
