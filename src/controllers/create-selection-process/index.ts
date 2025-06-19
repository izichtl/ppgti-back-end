import { controllerWrapper } from '../../lib/controllerWrapper';
import {
  createSelectionProcess,
} from '../../models/selection-processes';
import {
  createSelectionProcessSchema,
} from '../../models/selection-processes/types';


export const createSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const validatedData = createSelectionProcessSchema.parse(_req.body);

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

    const result = await createSelectionProcess(validatedData);

    if (result.error) {
      return _res.response.failure(result);
    }

    return _res.response.success(result);
  }
);