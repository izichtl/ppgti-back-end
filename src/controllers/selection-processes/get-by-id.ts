import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';

export const getSelectionProcessById = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;

  try {
    const { data: process, error } = await supabase
      .from('selection_processes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return response.failure({
          message: 'Processo seletivo não encontrado',
          status: 404,
        });
      }
      console.error('Erro ao recuperar processo seletivo:', error);
      return response.failure({
        message: 'Falha ao recuperar processo seletivo',
        status: 500,
      });
    }

    const processData = {
      ...process,
      documents_required: process.documents_required || [],
    };

    response.success({
      status: 200,
      message: 'Processo seletivo recuperado com sucesso',
      data: processData,
    });
  } catch (error) {
    console.error('Erro ao recuperar processo seletivo:', error);
    response.failure({
      message: 'Falha ao recuperar processo seletivo',
      status: 500,
    });
  }
});
