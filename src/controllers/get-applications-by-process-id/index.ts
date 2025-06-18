import { response, ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard } from '../../middlewares/auth/index';

export const getApplicationsByProcess = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];

  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return response.failure(guardResponse);
  }

  const process_id = _req.query.process_id;

  if (!process_id) {
    return response.failure({
      message: 'process_id é obrigatório na query string',
      status: 400,
    });
  }

  // const { data: applications, error } = await supabase
  //   .from('applications')
  //   .select(`
  //     *,
  //     candidates (
  //       id,
  //       name,
  //       email,
  //       cpf
  //     ),
  //     selection_processes (
  //       *
  //     ),
  //     research_lines (
  //       *
  //     ),
  //     research_topics (
  //       *
  //     )
  //   `)
  //   .eq('process_id', process_id);

  const { data: process, error } = await supabase
    .from('selection_processes')
    .select(`
      *,
      applications (
        *,
        candidates (
          id,
          name,
          email,
          cpf
        ),
        research_lines (
          *
        ),
        research_topics (
          *
        )
      )
    `)
    .eq('id', process_id)
    .single(); // se espera só um processo

  if (error) {
    return response.failure({
      message: 'Erro ao buscar candidaturas do processo seletivo',
      status: 500,
    });
  }

  return response.success({
    status: 200,
    message: 'Candidaturas do processo recuperadas com sucesso.',
    data: process,
  });
});
