import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard, getUserFromToken } from '../../middlewares/auth';
import { homologDataVerification } from '../../utils/homolog-data-guard';
import { updateHomologApplication } from './insert-or-update';


export const homologApplication = controllerWrapper(async (_req, _res) => {
    const token = _req.headers['authorization'];
    
    const guardResponse: ResponsePayload = authGuard(token as string);
    if (guardResponse.error) {
      return _res.response.failure(guardResponse);
    }
    const user: any = await getUserFromToken(token as string);

    const body = _req.body

    body.verified_id_by = user.id
    body.verifier_if_registration = user.if_registration

    const data = homologDataVerification(body)

    if (!data) {
      console.log('error on homolog data');
      return _res.response.failure({ message: 'Invalid Params', status: 401 });
    }

    const response =  await updateHomologApplication(body);
    if(response.error) {
      _res.response.failure(response)
    } else {
      _res.response.success(response)
    }
  }
);
