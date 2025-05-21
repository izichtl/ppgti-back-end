import { response, ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import supabaseSignedUrl from '../../storage';
import { authGuard, getUserFromToken } from '../../middlewares/auth/index';

// TODO precisa fazer o tratamento de erro
export const candidateFilerList = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  // guard-jwt
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return response.failure(guardResponse);
  }

  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;

  // Primeiro, tenta buscar o usuário
  // @ts-expect-error
  const { data: candidateDocuments, error: fetchError } = await supabase
    .from('candidate_documents')
    .select('*')
    .eq('cpf', cpf)
    .maybeSingle();

  if (candidateDocuments === undefined || candidateDocuments === null) {
    return response.failure({
      message: 'User data not found',
      status: 404,
    });
  }

  const signedUrls = await Promise.all(
    Object.entries(candidateDocuments).map(async ([key, value]) => {
      if (typeof value === 'string') {
        try {
          const url = await supabaseSignedUrl(value);
          return [key, url];
        } catch (error) {
          console.error(`Erro ao assinar ${key}:`, error);
          return [key, null];
        }
      }
      return [key, null];
    })
  );

  const signedUrlsObject = Object.fromEntries(signedUrls);
  signedUrlsObject.id = candidateDocuments.id;
  signedUrlsObject.cpf = candidateDocuments.cpf;

  response.success({
    status: 200,
    data: signedUrlsObject,
  });
});
