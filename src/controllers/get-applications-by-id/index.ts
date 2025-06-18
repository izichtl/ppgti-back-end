import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard } from '../../middlewares/auth/index';
import { getAplicationDataById } from '../../models/application-by-process-id';

export const getApplicationById = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const application_id = _req.query.application_id;

  if (!application_id) {
    return _res.response.failure({
      message: 'Invalid Params',
      status: 401,
    });
  }

  const response = await getAplicationDataById(Number(application_id))

  if (response.error) {
    _res.response.failure(response);
  }
  if (!response.error) {
    _res.response.success(response);
  }

});
