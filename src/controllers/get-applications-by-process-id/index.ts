import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard } from '../../middlewares/auth/index';
import { getAplicationDataProcessId } from '../../models/application-by-process-id';
import supabaseSignedUrl from '../../storage';
import { groupApplicationsByCandidate } from '../../utils/group-applications-by-user';
import {
  // Application,
  separateApplicationsByTopic,
} from '../../utils/applications-outdate-filter';

export const getApplicationsByProcess = controllerWrapper(
  async (_req, _res) => {
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

    const response = await getAplicationDataProcessId(Number(process_id));

    const applications =
      response['data'].applications !== undefined
        ? response['data'].applications
        : [];

    // filtra as aplicações para retornar apenas a ultima válida
    const grouped = groupApplicationsByCandidate(applications);
    const results = await Promise.all(
      grouped.map(async (group) => {
        const r = await separateApplicationsByTopic(group.applications);
        return r.validApplications;
      })
    );
    const allApplications = results.flat();

    const signedApplications = await Promise.all(
      allApplications.map(async (value: any) => {
        if (typeof value.project_path === 'string') {
          try {
            const url = await supabaseSignedUrl(value.project_path);
            value.project_path = url;
            return value;
          } catch (error) {
            console.error(`Erro ao assinar:`, error);
            value.project_path = null;
            return value;
          }
        }
        value.project_path = null;
        return value;
      })
    );

    response['data'].applications = signedApplications;

    if (response.error) {
      _res.response.failure(response);
    }
    if (!response.error) {
      _res.response.success(response);
    }
  }
);
