import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import AppDataSource from '../../db';
import { z } from 'zod';

const statusEnum = z.enum(['draft', 'published', 'closed']);

const createSelectionProcessSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid date',
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid date',
  }),
  application_deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Application deadline must be a valid date',
  }),
  result_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Result date must be a valid date',
  }),
  documents_required: z.array(z.string()).default([]),
  evaluation_criteria: z.string().optional(),
  contact_info: z.string().optional(),
  status: statusEnum.default('draft'),
  program: z.string().min(1, 'Program is required'),
  year: z.string().min(4, 'Year must be at least 4 characters'),
  semester: z.string().min(1, 'Semester is required'),
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

  // Validate date logic
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const appDeadline = new Date(application_deadline);
  const resultDate = new Date(result_date);

  if (endDate <= startDate) {
    return response.invalid({
      message: 'End date must be after start date',
      status: 400,
    });
  }

  if (appDeadline <= startDate) {
    return response.invalid({
      message: 'Application deadline must be after start date',
      status: 400,
    });
  }

  if (resultDate <= appDeadline) {
    return response.invalid({
      message: 'Result date must be after application deadline',
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

    // Parse documents_required back to array for response
    const processData = {
      ...result[0],
      documents_required: JSON.parse(result[0].documents_required || '[]'),
    };

    response.success({
      status: 201,
      message: 'Selection process created successfully',
      data: processData,
    });
  } catch (error) {
    console.error('Error creating selection process:', error);
    response.failure({
      message: 'Failed to create selection process',
      status: 500,
    });
  }
});

export const getSelectionProcesses = controllerWrapper(async (_req, _res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  try {
    const processes = await AppDataSource.query(
      `
      SELECT * FROM selection_processes
      ORDER BY created_at DESC, id
      `
    );

    // Parse documents_required for each process
    const processesWithParsedDocs = processes.map((process: any) => ({
      ...process,
      documents_required: JSON.parse(process.documents_required || '[]'),
    }));

    response.success({
      status: 200,
      message: 'Selection processes retrieved successfully',
      data: processesWithParsedDocs,
      total_count: processes.length,
    });
  } catch (error) {
    console.error('Error retrieving selection processes:', error);
    response.failure({
      message: 'Failed to retrieve selection processes',
      status: 500,
    });
  }
});

export const getSelectionProcessById = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  try {
    const process = await AppDataSource.query(
      `
      SELECT * FROM selection_processes
      WHERE id = $1
      `,
      [id]
    );

    if (process.length === 0) {
      return response.failure({
        message: 'Selection process not found',
        status: 404,
      });
    }

    // Parse documents_required back to array
    const processData = {
      ...process[0],
      documents_required: JSON.parse(process[0].documents_required || '[]'),
    };

    response.success({
      status: 200,
      message: 'Selection process retrieved successfully',
      data: processData,
    });
  } catch (error) {
    console.error('Error retrieving selection process:', error);
    response.failure({
      message: 'Failed to retrieve selection process',
      status: 500,
    });
  }
});

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
    return response.failure({
      message: 'Selection process not found',
      status: 404,
    });
  }

  // Validate dates if provided
  if (validatedData.start_date && validatedData.end_date) {
    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);

    if (endDate <= startDate) {
      return response.invalid({
        message: 'End date must be after start date',
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
    return response.invalid({
      message: 'No fields to update',
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

    // Parse documents_required back to array
    const processData = {
      ...result[0],
      documents_required: JSON.parse(result[0].documents_required || '[]'),
    };

    response.success({
      status: 200,
      message: 'Selection process updated successfully',
      data: processData,
    });
  } catch (error) {
    console.error('Error updating selection process:', error);
    response.failure({
      message: 'Failed to update selection process',
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
      return response.failure({
        message: 'Selection process not found',
        status: 404,
      });
    }

    // Check if there are any applications for this process
    const applications = await AppDataSource.query(
      `SELECT COUNT(*) as count FROM applications WHERE process_id = $1`,
      [id]
    );

    if (parseInt(applications[0].count) > 0) {
      return response.failure({
        message: 'Cannot delete selection process with existing applications',
        status: 409,
      });
    }

    await AppDataSource.query(`DELETE FROM selection_processes WHERE id = $1`, [
      id,
    ]);

    response.success({
      status: 200,
      message: 'Selection process deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting selection process:', error);
    response.failure({
      message: 'Failed to delete selection process',
      status: 500,
    });
  }
});
