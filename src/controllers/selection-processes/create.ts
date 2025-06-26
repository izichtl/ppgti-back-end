import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { createSelectionProcessSchema } from './types';

export const createSelectionProcess = controllerWrapper(async (_req, _res) => {
  const validatedData = createSelectionProcessSchema.parse(_req.body);

  const {
    title,
    description,
    start_date,
    end_date,
    application_deadline,
    result_date,
    documents_required,
    evaluation_criteria,
    contact_info,
    status,
    program,
    year,
    semester,
  } = validatedData;

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const appDeadline = new Date(application_deadline);
  const resultDate = new Date(result_date);

  if (endDate <= startDate) {
    return response.invalid({
      message: 'Data de fim deve ser posterior à data de início',
      status: 400,
    });
  }

  if (appDeadline <= startDate) {
    return response.invalid({
      message: 'Prazo de inscrição deve ser posterior à data de início',
      status: 400,
    });
  }

  if (resultDate <= appDeadline) {
    return response.invalid({
      message: 'Data do resultado deve ser posterior ao prazo de inscrição',
      status: 400,
    });
  }

  try {
    const { data, error } = await supabase
      .from('selection_processes')
      .insert({
        title,
        description: description || null,
        start_date,
        end_date,
        application_deadline,
        result_date,
        documents_required,
        evaluation_criteria: evaluation_criteria || null,
        contact_info: contact_info || null,
        status,
        program,
        year,
        semester,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar processo seletivo:', error);
      return response.failure({
        message: 'Falha ao criar processo seletivo',
        status: 500,
      });
    }

    const processData = {
      ...data,
      documents_required: data.documents_required || [],
    };

    response.success({
      status: 201,
      message: 'Processo seletivo criado com sucesso',
      data: processData,
    });
  } catch (error) {
    console.error('Erro ao criar processo seletivo:', error);
    response.failure({
      message: 'Falha ao criar processo seletivo',
      status: 500,
    });
  }
});
