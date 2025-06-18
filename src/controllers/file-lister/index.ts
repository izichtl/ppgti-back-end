// @ts-nocheck
// TODO AJUSTAR TYPES
// TUDO CRIAR GUARD
import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import supabaseSignedUrl from '../../storage';
import { authGuard, getUserFromToken } from '../../middlewares/auth/index';
import { handlerCandidateFiles } from '../../models/cadidate-files';

export const candidateFilerList = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  // guard-jwt
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }

  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;
  const cadidateFiles = await handlerCandidateFiles(cpf);

  if (cadidateFiles !== null) {
    if (cadidateFiles.error) {
      return _res.response.failure(cadidateFiles);
    }
  }

  const signedUrls = await Promise.all(
    //@ts-expect-error
    Object.entries(cadidateFiles.data).map(async ([key, value]) => {
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
  signedUrlsObject.id = cadidateFiles.data.id;
  signedUrlsObject.cpf = cadidateFiles.data.cpf;

  _res.response.success({
    status: 200,
    data: signedUrlsObject,
  });
});
