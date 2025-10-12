import { supabase } from "../../db";
import { ResponsePayload } from '../../middlewares/response';
import { Application } from "../../utils/applications-outdate-filter";

export interface ApplicationsResponse extends Omit<ResponsePayload, 'data'> {
  data?: Application[];
}

export const handlerCandidateApplications = async (cpf: string): Promise<ApplicationsResponse> => {
  
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('id')
    .eq('cpf', cpf)
  .single();
  if (candidateError !== null) {
    return { error: true, message: 'User not found', status: 404 };
  }

  const candidate_id = candidate.id;

  const { data: applications, error: applicationError } = await supabase
    .from('applications')
    .select(`
      *,
      selection_processes (
        *
      ),
      research_lines (
        *
      ),
      research_topics (
        *
      )
    `)
  .eq('candidate_id', candidate_id);
  
  if (applicationError !== null) {
    return { error: true, message: 'Applications not found', status: 404 };
  }

  if (applications !== null) {
    return {
      error: false,
      message: 'User applications founded',
      status: 200,
      data: applications,
    };
  } else {
    return {
      error: true,
      message: 'Generic Error',
      status: 500,
    };
  }
}