import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';

export const deleteSelectionProcess = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;

  try {
    const { data: _existingProcess, error: checkError } = await supabase
      .from('selection_processes')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return response.failure({
          message: 'Processo seletivo não encontrado',
          status: 404,
        });
      }
      console.error('Erro ao verificar processo seletivo:', checkError);
      return response.failure({
        message: 'Falha ao verificar processo seletivo',
        status: 500,
      });
    }

    // Checa se há inscrições para o processo seletivo
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id', { count: 'exact' })
      .eq('process_id', id);

    if (appError) {
      console.error('Erro ao verificar inscrições:', appError);
      return response.failure({
        message: 'Falha ao verificar inscrições',
        status: 500,
      });
    }

    if (applications && applications.length > 0) {
      return response.failure({
        message:
          'Não é possível excluir processo seletivo com inscrições existentes',
        status: 409,
      });
    }

    const { error: deleteError } = await supabase
      .from('selection_processes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erro ao excluir processo seletivo:', deleteError);
      return response.failure({
        message: 'Falha ao excluir processo seletivo',
        status: 500,
      });
    }

    response.success({
      status: 200,
      message: 'Processo seletivo excluído com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir processo seletivo:', error);
    response.failure({
      message: 'Falha ao excluir processo seletivo',
      status: 500,
    });
  }
});
