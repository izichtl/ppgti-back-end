import { supabase } from '../../db';

export const updateHomologApplication = async (verificationData: any) => {
  try {
    const { data: existing, error: existingError } = await supabase
      .from('applications_verification')
      .select('id')
      .eq('application_id', verificationData.application_id)
      .eq('process_id', verificationData.process_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      return {
        error: true,
        message: 'Erro ao buscar verificação existente',
        status: 500,
        code: existingError.code,
      };
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('applications_verification')
        .update(verificationData)
        .eq('id', existing.id);

      if (updateError) {
        return {
          error: true,
          message: 'Erro ao atualizar verificação',
          status: 500,
          code: updateError.code,
        };
      }

      return {
        error: false,
        message: 'Verificação atualizada com sucesso',
        status: 200,
      };
    } else {
      const { error: insertError, data: inserted } = await supabase
        .from('applications_verification')
        .insert(verificationData)
        .select();

      if (insertError) {
        return {
          error: true,
          message: 'Erro ao inserir nova verificação',
          status: 500,
          code: insertError.code,
        };
      }

      return {
        error: false,
        message: 'Verificação inserida com sucesso',
        status: 201,
        data: inserted,
      };
    }
  } catch (err) {
    return {
      error: true,
      message: 'Erro inesperado ao processar verificação',
      status: 500,
    };
  }
};
