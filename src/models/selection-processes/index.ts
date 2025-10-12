import { ResponsePayload } from '../../middlewares/response';
import { supabase } from '../../db';
import {
  CreateSelectionProcessPayload,
  UpdateSelectionProcessPayload,
} from './types';

export const createSelectionProcess = async (
  data: CreateSelectionProcessPayload
): Promise<ResponsePayload> => {
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
  } = data;

  try {
    const { data: result, error } = await supabase
      .from('selection_processes')
      .insert([
        {
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
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar processo seletivo:', error);
      return {
        error: true,
        message: 'Falha ao criar processo seletivo',
        status: 500,
      };
    }

    const processData = {
      ...result,
      documents_required: result.documents_required || [],
    };

    return {
      error: false,
      message: 'Processo seletivo criado com sucesso',
      status: 201,
      data: processData,
    };
  } catch (error) {
    console.error('Erro ao criar processo seletivo:', error);
    return {
      error: true,
      message: 'Falha ao criar processo seletivo',
      status: 500,
    };
  }
};

export const getAllSelectionProcesses = async (): Promise<ResponsePayload> => {
  try {
    const { data: processes, error } = await supabase
      .from('selection_processes')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao recuperar processos seletivos:', error);
      return {
        error: true,
        message: 'Falha ao recuperar processos seletivos',
        status: 500,
      };
    }

    if (!processes || processes.length === 0) {
      return {
        error: false,
        message: 'Nenhum processo seletivo encontrado',
        status: 200,
        data: [],
        total_count: 0,
      };
    }

    const processesWithParsedDocs = processes.map((process: any) => ({
      ...process,
      documents_required: process.documents_required || [],
    }));

    return {
      error: false,
      message: 'Processos seletivos recuperados com sucesso',
      status: 200,
      data: processesWithParsedDocs,
      total_count: processes.length,
    };
  } catch (error) {
    console.error('Erro ao recuperar processos seletivos:', error);
    return {
      error: true,
      message: 'Falha ao recuperar processos seletivos',
      status: 500,
    };
  }
};

export const getSelectionProcessById = async (
  id: string
): Promise<ResponsePayload> => {
  try {
    const { data: process, error } = await supabase
      .from('selection_processes')
      .select('*')
      .eq('id', id)
      .single();

    if (!process) {
      return {
        error: true,
        message: 'Processo seletivo não encontrado',
        status: 404,
      };
    }

    if (error) {
      console.error('Erro ao recuperar processo seletivo:', error);
      return {
        error: true,
        message: 'Falha ao recuperar processo seletivo',
        status: 500,
      };
    }

    const processData = {
      ...process,
      documents_required: process.documents_required || [],
    };

    return {
      error: false,
      message: 'Processo seletivo recuperado com sucesso',
      status: 200,
      data: processData,
    };
  } catch (error) {
    console.error('Erro ao recuperar processo seletivo:', error);
    return {
      error: true,
      message: 'Falha ao recuperar processo seletivo',
      status: 500,
    };
  }
};

export const updateSelectionProcess = async (
  id: string,
  data: UpdateSelectionProcessPayload
): Promise<ResponsePayload> => {
  try {
    const { data: existingProcess, error: checkError } = await supabase
      .from('selection_processes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingProcess) {
      console.error('Processo seletivo não encontrado');
      return {
        error: true,
        message: 'Processo seletivo não encontrado',
        status: 404,
      };
    }

    if (checkError) {
      console.error('Erro ao verificar processo seletivo:', checkError);
      return {
        error: true,
        message: 'Erro ao verificar processo seletivo',
        status: 500,
      };
    }

    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    if (Object.keys(updateData).length === 0) {
      return {
        error: true,
        message: 'Nenhum campo para atualizar',
        status: 400,
      };
    }

    updateData.updated_at = new Date().toISOString();

    const { data: result, error } = await supabase
      .from('selection_processes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar processo seletivo:', error);
      return {
        error: true,
        message: 'Falha ao atualizar processo seletivo',
        status: 500,
      };
    }

    const processData = {
      ...result,
      documents_required: result.documents_required || [],
    };

    return {
      error: false,
      message: 'Processo seletivo atualizado com sucesso',
      status: 200,
      data: processData,
    };
  } catch (error) {
    console.error('Erro ao atualizar processo seletivo:', error);
    return {
      error: true,
      message: 'Falha ao atualizar processo seletivo',
      status: 500,
    };
  }
};

export const deleteSelectionProcess = async (
  id: string
): Promise<ResponsePayload> => {
  try {
    const { data: existingProcess, error: checkError } = await supabase
      .from('selection_processes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingProcess) {
      return {
        error: true,
        message: 'Processo seletivo não encontrado',
        status: 404,
      };
    }

    if (checkError) {
      console.error('Erro ao verificar processo seletivo:', checkError);
      return {
        error: true,
        message: 'Erro ao verificar processo seletivo',
        status: 500,
      };
    }

    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('process_id', id);

    if (appError) {
      console.error('Erro ao verificar inscrições:', appError);
      return {
        error: true,
        message: 'Erro ao verificar inscrições existentes',
        status: 500,
      };
    }

    const applicationCount = applications?.length || 0;
    if (applicationCount > 0) {
      return {
        error: true,
        message:
          'Não é possível excluir processo seletivo com inscrições existentes',
        status: 409,
      };
    }

    const { error: deleteError } = await supabase
      .from('selection_processes')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      if (deleteError.code === '23503') {
        return {
          error: true,
          message: 'Não é possível excluir este processo seletivo pois existem candidaturas associadas.',
          status: 400,
        };
      }
    
      console.error('Erro ao excluir processo seletivo:', deleteError);
      return {
        error: true,
        message: 'Falha ao excluir processo seletivo.',
        status: 500,
      };
    }

    return {
      error: false,
      message: 'Processo seletivo excluído com sucesso',
      status: 200,
    };

  } catch (error) {
    console.error('Erro ao excluir processo seletivo:', error);
    return {
      error: true,
      message: 'Falha ao excluir processo seletivo2',
      status: 500,
    };
  }
};
