import AppDataSource from '../../db';
import supabaseSignedUrl from '../../storage';

export const updateCandidateDocument = async (
  cpf: string,
  column: string,
  value: string
) => {
  console.log('@@@@@@@@');
  console.log('@@@@@@@@');
  console.log('@@@@@@@@');
  console.log('@@@@@@@@');
  console.log('@@@@@@@@');
  const allowedColumns = new Set([
    '_formulario_pontuacao_',
    '_diploma_certificado_',
    '_historico_graducao_',
    '_quitacao_eleitoral_',
    '_comprovante_residencia_',
    '_quitacao_militar_',
    '_declaracao_cota_ingresso_',
    '_identidade_cpf_',
    '_declaracao_cota_servidor_',
  ]);

  if (!allowedColumns.has(column)) {
    throw new Error('Coluna inválida!');
  }

  const t = '11122233344/_sh_formulario_pontuacao_eh_NOTA_MARCO.pdf';
  const url = await supabaseSignedUrl(t);
  console.log(url, 'url-url');
  console.log(url, 'url-url');
  console.log(url, 'url-url');
  console.log(url, 'url-url');
  console.log(url, 'url-url');
  const query = `
    INSERT INTO candidate_documents (cpf, ${column})
    VALUES ($1, $2)
    ON CONFLICT (cpf)
    DO UPDATE SET ${column} = EXCLUDED.${column};
  `;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await AppDataSource.query(query, [cpf, value]);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};
