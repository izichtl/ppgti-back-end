import { response } from '../../middlewares/response';
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

    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);
    const appDeadline = new Date(validatedData.application_deadline);
    const resultDate = new Date(validatedData.result_date);

    if (endDate <= startDate) {
      return response.invalid({
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
