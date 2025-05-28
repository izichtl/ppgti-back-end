import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import AppDataSource from '../../db';
import { z } from 'zod';

const createSelectionProcessSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  program: z.string().min(1, 'Program is required'),
  year: z.string().min(4, 'Year must be at least 4 characters'),
  semester: z.string().min(1, 'Semester is required'),
  edital_link: z.string().url('Edital link must be a valid URL').optional(),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid date',
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid date',
  }),
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

  const { name, program, year, semester, edital_link, start_date, end_date } =
    validatedData;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Validate that end_date is after start_date
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (endDate <= startDate) {
    return response.invalid({
      message: 'End date must be after start date',
      status: 400,
    });
  }

  try {
    const result = await AppDataSource.query(
      `
      INSERT INTO selection_processes (name, program, year, semester, edital_link, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [name, program, year, semester, edital_link || null, start_date, end_date]
    );

    response.success({
      status: 201,
      message: 'Selection process created successfully',
      data: result[0],
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
      ORDER BY id DESC
      `
    );

    response.success({
      status: 200,
      message: 'Selection processes retrieved successfully',
      data: processes,
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

    response.success({
      status: 200,
      message: 'Selection process retrieved successfully',
      data: process[0],
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

  // Validate dates if both are provided
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
      updateFields.push(`${key} = $${paramIndex}`);
      updateValues.push(value);
      paramIndex++;
    }
  }

  if (updateFields.length === 0) {
    return response.invalid({
      message: 'No fields to update',
      status: 400,
    });
  }

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

    response.success({
      status: 200,
      message: 'Selection process updated successfully',
      data: result[0],
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
