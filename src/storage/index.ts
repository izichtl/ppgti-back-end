import { supabase } from '../db/index';

const supabaseSignedUrl = async (filePath: string): Promise<string | null> => {
  const time = 60 * 60 * 2;
  try {
    const { data, error } = await supabase.storage
      .from('registration-pdf')
      .createSignedUrl(filePath, time);

    if (error) {
      console.error('Erro ao gerar URL assinada:', error.message);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (error) {
    console.error('Erro inesperado ao gerar URL assinada:', error);
    return null;
  }
};

export default supabaseSignedUrl;
