import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard, getUserFromToken } from '../../middlewares/auth/index';
import { handlerCandidateApplications } from '../../models/cadidate-applications';
import supabaseSignedUrl from '../../storage';
import {
  Application,
  separateApplicationsByTopic,
} from '../../utils/applications-outdate-filter';
import { formatFortalezaDate } from '../../utils/date-format-to-utc';

export const getApplicationsByCpf = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;

  const candidateApplications: ResponsePayload =
    await handlerCandidateApplications(cpf);

  let valid: any = [];
  let outdated: any = [];
  const { validApplications, outdatedApplications } =
    await separateApplicationsByTopic(
      candidateApplications.data as Application[]
    );

  if (candidateApplications.error) {
    return _res.response.failure(candidateApplications);
  }
  if (!candidateApplications.error) {
    const data: any[] = validApplications;
    const outdatedData: any[] = outdatedApplications;
    if (data[0] !== undefined) {
      valid = await Promise.all(
        data.map(async (item: any) => {
          const program_year = item.selection_processes.year;
          const program_semester = item.selection_processes.semester;
          const program_date = `${program_year}-${program_semester}`;
          let url: any = '';

          if (typeof item.project_path === 'string') {
            try {
              url = await supabaseSignedUrl(item.project_path);
            } catch (error) {
              url = '';
            }
          }

          return {
            application_id: item.id,
            program: item.selection_processes.description,
            process_id: item.selection_processes.id,
            period: program_date,
            line: item.research_lines.name,
            line_id: item.line_id,
            topic: item.research_topics.name,
            topic_id: item.topic_id,
            tittle: item.project_title,
            date: formatFortalezaDate(item.application_date + 'Z'),
            project_url: url,
            valid: true,
          };
        })
      );
    }
    if (outdatedData[0] !== undefined) {
      outdated = await Promise.all(
        outdatedData.map(async (item: any) => {
          const program_year = item.selection_processes.year;
          const program_semester = item.selection_processes.semester;
          const program_date = `${program_year}-${program_semester}`;
          let url: any = '';

          return {
            application_id: item.id,
            program: item.selection_processes.description,
            process_id: item.selection_processes.id,
            period: program_date,
            line: item.research_lines.name,
            line_id: item.line_id,
            topic: item.research_topics.name,
            topic_id: item.topic_id,
            tittle: item.project_title,
            date: formatFortalezaDate(item.application_date + 'Z'),
            project_url: url,
            valid: false,
          };
        })
      );
    }
    candidateApplications.data = { valid, outdated };

    return _res.response.success(candidateApplications);
  }
});
