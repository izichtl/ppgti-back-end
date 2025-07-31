CREATE TABLE applications_verification (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  process_id INTEGER REFERENCES selection_processes(id) ON DELETE CASCADE,

  personal_data BOOLEAN DEFAULT FALSE,
  academic_data BOOLEAN DEFAULT FALSE,
  documents_data BOOLEAN DEFAULT FALSE,
  quota_data BOOLEAN DEFAULT FALSE,
  project_data BOOLEAN DEFAULT FALSE,

  verified_id_by INTEGER REFERENCES committee_members(id),
  verifier_if_registration VARCHAR(50),
  justify VARCHAR(200),
  final_status VARCHAR(50), -- Ex: 'Homologado' ou 'Recusado'

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
