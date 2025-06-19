import { controllerWrapper } from '../../lib/controllerWrapper';
import {
  deleteSelectionProcess,
} from '../../models/selection-processes';



export const deleteSelectionProcessController = controllerWrapper(
  async (_req, _res) => {
    const { id } = _req.params;

    const result = await deleteSelectionProcess(id);

    if (result.error) {
      return _res.response.failure(result);
    }

    return _res.response.success(result);
  }
);
