// // @ts-nocheck
import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { authGuard, getUserFromToken } from '../../middlewares/auth/index';
import { handlerCandidateApplications } from '../../models/cadidate-applications';
import supabaseSignedUrl from '../../storage';
import { format } from 'date-fns';

export const getApplicationsByCpf = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;
  
  const candidateApplications: ResponsePayload = await handlerCandidateApplications(cpf)
  
  if (candidateApplications.error) {
    return _res.response.failure(candidateApplications);
  }
  if (!candidateApplications.error) {
    const data: any[] = candidateApplications.data
    if (data[0] !== undefined) {
      candidateApplications.data = await Promise.all(
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
            period: program_date,
            line: item.research_lines.name,
            topic: item.research_topics.name,
            tittle: item.project_title,
            date: format(new Date(item.application_date), 'dd-MM-yyyy'),
            project_url: url,
          };
        })
      );
    }

    return _res.response.success(candidateApplications);
  }

});


