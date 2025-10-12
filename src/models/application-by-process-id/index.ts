import { supabase } from '../../db';
import { ResponsePayload } from '../../middlewares/response';
import supabaseSignedUrl from '../../storage';

export const getAplicationDataProcessId = async (
  id: number
): Promise<ResponsePayload> => {
  const { data: process, error } = await supabase
    .from('selection_processes')
    .select(
      `
    *,
    applications (
      *,
      candidates (
        id,
        name,
        email,
        cpf
      ),
      research_lines (
        *
      ),
      research_topics (
        *
      ),
      applications_verification!left (
      *
      )
    )
  `
    )
    .eq('id', id)
    .single();
  console.log(error);
  if (error !== null && error?.code === 'PGRST116') {
    return {
      error: false,
      message: 'Success o processo não tem inscrições',
      status: 200,
      data: [],
    };
  }
  if (error !== null) {
    return {
      error: true,
      message: 'Error on get applications',
      status: 404,
    };
  }
  if (process !== null) {
    return {
      error: false,
      message: 'Success on get applications',
      status: 200,
      data: process,
    };
  } else {
    return {
      error: true,
      message: 'Generic Error',
      status: 500,
    };
  }
};

export const getAplicationDataById = async (
  id: number
): Promise<ResponsePayload> => {
  const { data: application, error } = await supabase
    .from('applications')
    .select(
      `
      *,
      candidates (
        *
      ),
      research_lines (*),
      research_topics (*)
    `
    )
    .eq('id', id)
    .single();

  if (error !== null) {
    return {
      error: true,
      message: 'Error on get application',
      status: 404,
    };
  }

  const cpf = application?.candidates?.cpf;

  const { data: docs, error: docsError } = await supabase
    .from('candidate_documents')
    .select('*')
    .eq('cpf', cpf);

  if (docsError !== null) {
    return {
      error: true,
      message: 'Error on get documents',
      status: 404,
    };
  }

  if (application !== null && docs !== null) {
    // assina a url do projeto
    let project_path: any = '';
    if (typeof application.project_path === 'string') {
      try {
        project_path = await supabaseSignedUrl(application.project_path);
      } catch (error) {
        project_path = '';
      }
    }
    application.project_path = project_path;

    // assina as urls dos documentos
    const newDocs: any = docs[0];
    delete newDocs.cpf;
    delete newDocs.id;
    // can be a function
    const signedUrls = await Promise.all(
      Object.entries(newDocs).map(async ([key, value]) => {
        if (typeof value === 'string') {
          try {
            const url = await supabaseSignedUrl(value);
            return [key, url];
          } catch (error) {
            console.error(`Erro ao assinar ${key}:`, error);
            return [key, ''];
          }
        }
        return [key, ''];
      })
    );
    const signedUrlsObject = Object.fromEntries(signedUrls);
    // can be a function
    application.docs = signedUrlsObject;

    return {
      error: false,
      message: 'Success on get application',
      status: 200,
      data: application,
    };
  } else {
    return {
      error: true,
      message: 'Generic Error',
      status: 500,
    };
  }
};
