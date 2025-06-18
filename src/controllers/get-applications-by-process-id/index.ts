import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard } from '../../middlewares/auth/index';
import { getAplicationDataProcessId } from '../../models/application-by-process-id';

export const getApplicationsByProcess = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const process_id = _req.query.process_id;

  if (!process_id) {
    return _res.response.failure({
      message: 'Invalid Params',
      status: 401,
    });
  }

  const response = await getAplicationDataProcessId(Number(process_id))

  if (response.error) {
    _res.response.failure(response);
  }
  if (!response.error) {
    _res.response.success(response);
  }

});
