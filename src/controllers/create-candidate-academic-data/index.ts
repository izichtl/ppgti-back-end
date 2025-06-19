import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard, getUserFromToken } from '../../middlewares/auth';

export const candidateAcademicUpdater = controllerWrapper(
  async (_req, _res) => {
    const token = _req.headers['authorization'];
    const guardResponse: ResponsePayload = authGuard(token as string);

    if (guardResponse.error) {
      return _res.response.failure(guardResponse);
    }

    const user = await getUserFromToken(token as string);
    const { cpf, email } = user as any;

    const {
      education_level,
      graduation_course,
      graduation_year,
      graduation_institution,
      specialization_course,
      specialization_year,
      specialization_institution,
      lattes_link,
    } = _req.body;

    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        education_level,
        graduation_course,
        graduation_year,
        graduation_institution,
        specialization_course,
        specialization_year,
        specialization_institution,
        lattes_link,
      })
      .eq('cpf', cpf)
      .eq('email', email);

    if (updateError) {
      return _res.response.failure({
        message: 'Erro ao atualizar dados acadêmicos',
        status: 400,
      });
    }

    return _res.response.success({
      message: 'Dados acadêmicos atualizados com sucesso',
      status: 200,
    });
  }
);
