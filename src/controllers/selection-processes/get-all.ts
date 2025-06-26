import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';

export const getSelectionProcesses = controllerWrapper(async (_req, _res) => {
  try {
    const { data: processes, error } = await supabase
      .from('selection_processes')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao recuperar processos seletivos:', error);
      return response.failure({
        message: 'Falha ao recuperar processos seletivos',
        status: 500,
      });
    }

    const processesWithParsedDocs = processes.map((process: any) => ({
      ...process,
      documents_required: process.documents_required || [],
    }));

    response.success({
      status: 200,
      message: 'Processos seletivos recuperados com sucesso',
      data: processesWithParsedDocs,
      total_count: processes.length,
    });
  } catch (error) {
    console.error('Erro ao recuperar processos seletivos:', error);
    response.failure({
      message: 'Falha ao recuperar processos seletivos',
      status: 500,
    });
  }
});
