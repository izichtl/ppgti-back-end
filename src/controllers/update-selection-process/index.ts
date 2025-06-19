
import { controllerWrapper } from '../../lib/controllerWrapper';
import {
  updateSelectionProcess,
} from '../../models/selection-processes';
import {
  updateSelectionProcessSchema,
} from '../../models/selection-processes/types';
// TODO INSTALAR AUTHGUARD
export const updateSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;
    const validatedData = updateSelectionProcessSchema.parse(_req.body);

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

    const result = await updateSelectionProcess(id, validatedData);

    if (result.error) {
      return _res.response.failure(result);
    }

    return _res.response.success(result);
  }
);