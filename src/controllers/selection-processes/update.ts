import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { updateSelectionProcessSchema } from './types';

export const updateSelectionProcess = controllerWrapper(async (_req, _res) => {
  const { id } = _req.params;
  const validatedData = updateSelectionProcessSchema.parse(_req.body);

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

  if (validatedData.start_date && validatedData.end_date) {
    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);

    if (endDate <= startDate) {
      return response.invalid({
        message: 'Data de fim deve ser posterior à data de início',
        status: 400,
      });
    }
  }

  const updateData: any = {
    ...validatedData,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data: result, error } = await supabase
      .from('selection_processes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar processo seletivo:', error);
      return response.failure({
        message: 'Falha ao atualizar processo seletivo',
        status: 500,
      });
    }

    const processData = {
      ...result,
      documents_required: result.documents_required || [],
    };

    response.success({
      status: 200,
      message: 'Processo seletivo atualizado com sucesso',
      data: processData,
    });
  } catch (error) {
    console.error('Erro ao atualizar processo seletivo:', error);
    response.failure({
      message: 'Falha ao atualizar processo seletivo',
      status: 500,
    });
  }
});
