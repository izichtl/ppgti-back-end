// @ts-nocheck
// import {  } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import {
  createSelectionProcess,
  getAllSelectionProcesses,
  getSelectionProcessById,
  updateSelectionProcess,
  deleteSelectionProcess,
} from '../../models/selection-processes';
import {
  createSelectionProcessSchema,
  updateSelectionProcessSchema,
} from '../../models/selection-processes/types';

export const createSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const validatedData = createSelectionProcessSchema.parse(_req.body);

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
    const appDeadline = new Date(validatedData.application_deadline);
    const resultDate = new Date(validatedData.result_date);

    if (endDate <= startDate) {
      return _res.response.invalid({
        message: 'Data de fim deve ser posterior à data de início',
        status: 400,
      });
    }

    if (appDeadline <= startDate) {
      return response.invalid({
        message: 'Prazo de inscrição deve ser posterior à data de início',
        status: 400,
      });
    }

    if (resultDate <= appDeadline) {
      return response.invalid({
        message: 'Data do resultado deve ser posterior ao prazo de inscrição',
        status: 400,
      });
    }

    const result = await createSelectionProcess(validatedData);

    if (result.error) {
      return response.failure(result);
    }

    return response.success(result);
  }
);

export const getSelectionProcessesController = controllerWrapper(
  async (_req, _res) => {
    const result = await getAllSelectionProcesses();

    if (result.error) {
      return response.failure(result);
    }

    return response.success(result);
  }
);

export const getSelectionProcessByIdController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;

    const result = await getSelectionProcessById(id);

    if (result.error) {
      return response.failure(result);
    }

    return response.success(result);
  }
);

export const updateSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;
    const validatedData = updateSelectionProcessSchema.parse(_req.body);

    // Validate dates if provided
    if (validatedData.start_date && validatedData.end_date) {
      const startDate = new Date(validatedData.start_date);
      const endDate = new Date(validatedData.end_date);

      if (endDate <= startDate) {
        return response.invalid({
          message: 'Data de fim deve ser posterior à data de início',
          status: 400,
        });
      }
    }

    const result = await updateSelectionProcess(id, validatedData);

    if (result.error) {
      return response.failure(result);
    }

    return response.success(result);
  }
);

export const deleteSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;

    const result = await deleteSelectionProcess(id);

    if (result.error) {
      return response.failure(result);
    }

    return response.success(result);
  }
);
