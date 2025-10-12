import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard, getUserFromToken } from '../../middlewares/auth/index';
import { handlerCandidateApplications } from '../../models/cadidate-applications';
import { buildValidationByProcessV2 } from '../../utils/applications-validation';

export const getApplicationsValidationByCpf = controllerWrapper(
  async (_req, _res) => {
    const token = _req.headers['authorization'];
    const guardResponse: ResponsePayload = authGuard(token as string);
    if (guardResponse.error) {
      return _res.response.failure(guardResponse);
    }

    const user = await getUserFromToken(token as string);
    const { cpf } = user as any;

    const candidateApplications: ResponsePayload =
      await handlerCandidateApplications(cpf);

    const cleanUpApplications = candidateApplications.data.map((item: any) => {
      return {
        application_id: item.id,
        process_id: item.selection_processes.id,
        line_id: item.line_id,
        topic_id: item.topic_id,
      };
    });

    const validationObject = await buildValidationByProcessV2(
      cleanUpApplications
    );

    candidateApplications.data = validationObject;
    return _res.response.success(candidateApplications);
  }
);
