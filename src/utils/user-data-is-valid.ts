type FormData = Record<string, any>;

export function validateRequiredFields(data: FormData): boolean {
  const requiredFields = [
    // stepOneSchema
    'email',
    'cpf',
    'social_name',
    // stepTwoSchema
    'sex',
    'registration_',
    'registration_state',
    'registration_place',
    'address',
    'address_number',
    'address_neighborhood',
    'address_city',
    'address_state',
    'address_zipcode',
    'cell_phone',
    'other_email',
    'quota_id',
    // stepThreeSchema
    'education_level',
    'graduation_course',
    'graduation_year',
    'graduation_institution',
    'lattes_link',
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return false;
    }
  }

  return true;
}
