export function  homologDataVerification
(payload: any) {
  const requiredFields = [
    'application_id',
    'process_id',
    'personal_data',
    'academic_data',
    'documents_data',
    'quota_data',
    'project_data',
    'final_status',
    'verified_id_by',
    'verifier_if_registration',
  ];

  for (const field of requiredFields) {
    if (
      payload[field] === undefined ||
      payload[field] === null
    ) {
      return false;
    }
  }

  return true;
}