import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard } from '../../middlewares/auth/index';

export const getSelectionProcesses = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const { data, error } = await supabase.from('selection_processes').select(`
     *,
      research_lines (
       *,
        research_topics (
         *
        )
      )
  `);

  if (error !== null) {
    _res.response.failure({
      message: 'Falha ao recuperar processos seletivos',
      status: 500,
    });
  }

  const processesWithParsedDocs = data?.map((process: any) => ({
    ...process,
    documents_required: process.documents_required || [],
  }));

  _res.response.success({
    status: 200,
    message: 'Processos seletivos recuperados com sucesso',
    data: processesWithParsedDocs,
  });
});
