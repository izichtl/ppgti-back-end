import { controllerWrapper } from '../../lib/controllerWrapper';
import {
  getSelectionProcessById,
} from '../../models/selection-processes';


export const getSelectionProcessByIdController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;

    const result = await getSelectionProcessById(id);

    if (result.error) {
      return _res.response.failure(result);
    }

    return _res.response.success(result);
  }
);