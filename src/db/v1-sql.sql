-- // TODO AJUSTAR A TABELA CANDIDATES NO SQL 
-- // TODO CRIAR SQL PARA INSERIR O MINIMO DE DADOS
-- geral dos cadidatos
-- 
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    social_name VARCHAR(255),
    sex VARCHAR(10),
    registration_ VARCHAR(50),
    registration_state VARCHAR(50),
    registration_place VARCHAR(255),
    address VARCHAR(255),
    address_number VARCHAR(50),
    address_complement VARCHAR(255),
    address_neighborhood VARCHAR(255),
    address_city VARCHAR(255),
    address_state VARCHAR(50),
    address_zipcode VARCHAR(20),
    cell_phone VARCHAR(20),
    phone VARCHAR(20),
    other_email VARCHAR(255),
    quota VARCHAR(100),
    education_level VARCHAR(255),
    graduation_course VARCHAR(255),
    graduation_year VARCHAR(4),
    graduation_institution VARCHAR(255),
    specialization_course VARCHAR(255),
    specialization_year VARCHAR(4),
    specialization_institution VARCHAR(255),
    lattes_link VARCHAR(255)
);

-- documentos do candidado
--
CREATE TABLE candidate_documents (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(20) NOT NULL,
    score_form VARCHAR(255),
    diploma_certificate VARCHAR(255),
    undergraduate_transcript VARCHAR(255),
    electoral_clearance VARCHAR(255),
    proof_of_residence VARCHAR(255),
    military_clearance VARCHAR(255),
    quota_declaration_admission VARCHAR(255),
    quota_declaration_if VARCHAR(255),
    registration_clearance VARCHAR(255),
    FOREIGN KEY (cpf) REFERENCES candidates (cpf) ON DELETE CASCADE
);

-- outdated
-- CREATE TABLE candidate_documents (
--     id SERIAL PRIMARY KEY,
--     cpf VARCHAR(20) NOT NULL,
--     _formulario_pontuacao_ VARCHAR(255),
--     _diploma_certificado_ VARCHAR(255),
--     _historico_graducao_ VARCHAR(255),
--     _quitacao_eleitoral_ VARCHAR(255),
--     _comprovante_residencia_ VARCHAR(255),
--     _quitacao_militar_ VARCHAR(255),
--     _declaracao_cota_ingresso_ VARCHAR(255),
--     _declaracao_cota_servidor_ VARCHAR(255),
--     _identidade_cpf_ VARCHAR(255),
--     FOREIGN KEY (cpf) REFERENCES candidates (cpf) ON DELETE CASCADE
-- );

ALTER TABLE candidate_documents ADD CONSTRAINT unique_cpf UNIQUE (cpf);

-- membros da comissão
-- preciso definir se vai ser matricula
-- ou cpf/email

CREATE TABLE committee_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    if_registration VARCHAR(14) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- processo seletivo abertos ou não
-- vai ser definido pelo intervalo de data
CREATE TABLE selection_processes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    result_date DATE,
    documents_required JSONB DEFAULT '[]'::jsonb,
    evaluation_criteria TEXT,
    contact_info TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    program VARCHAR(100),
    year VARCHAR(20),
    semester VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- linha de pesquisa
--
CREATE TABLE research_lines (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES selection_processes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);

-- tema de pesquisa
--
CREATE TABLE research_topics (
  id SERIAL PRIMARY KEY,
  line_id INTEGER NOT NULL REFERENCES research_lines(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);

-- inscricoes no processos
--
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    process_id INTEGER REFERENCES selection_processes(id),
    line_id INTEGER REFERENCES research_lines(id),
    topic_id INTEGER REFERENCES research_topics(id),
    project_title TEXT,
    project_path TEXT,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- homologacao da inscricao
--
CREATE TABLE applications_verification (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    process_id INTEGER REFERENCES selection_processes(id) ON DELETE CASCADE,
    
    academic_data_verified BOOLEAN DEFAULT FALSE,
    score_form_verified BOOLEAN DEFAULT FALSE,
    diploma_certificate_verified BOOLEAN DEFAULT FALSE,
    undergraduate_transcript_verified BOOLEAN DEFAULT FALSE,
    electoral_clearance_verified BOOLEAN DEFAULT FALSE,
    proof_of_residence_verified BOOLEAN DEFAULT FALSE,
    military_clearance_verified BOOLEAN DEFAULT FALSE,
    quota_declaration_admission_verified BOOLEAN DEFAULT FALSE,
    quota_declaration_if_verified BOOLEAN DEFAULT FALSE,
    registration_clearance_verified BOOLEAN DEFAULT FALSE,
    
    final_status VARCHAR(50) -- Homologado, Recusado
);

CREATE TABLE applications_verification (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    process_id INTEGER REFERENCES selection_processes(id) ON DELETE CASCADE,
    
    -- academic_data_verified BOOLEAN DEFAULT FALSE,
    -- score_form_verified BOOLEAN DEFAULT FALSE,
    -- diploma_certificate_verified BOOLEAN DEFAULT FALSE,
    -- undergraduate_transcript_verified BOOLEAN DEFAULT FALSE,
    -- electoral_clearance_verified BOOLEAN DEFAULT FALSE,
    -- proof_of_residence_verified BOOLEAN DEFAULT FALSE,
    -- military_clearance_verified BOOLEAN DEFAULT FALSE,
    -- quota_declaration_admission_verified BOOLEAN DEFAULT FALSE,
    -- quota_declaration_if_verified BOOLEAN DEFAULT FALSE,
    -- registration_clearance_verified BOOLEAN DEFAULT FALSE,
    
    final_status VARCHAR(50) -- Homologado, Recusado
);


-- 1. Criar a tabela quotas
CREATE TABLE quotas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500)
);

-- 3. Inserir instâncias com descrição
INSERT INTO quotas (name, description) VALUES
  ('nao_optante', 'Não optante por sistema de cotas'),
  ('afro_ou_inde', 'Autodeclarado preto, pardo ou indígena'),
  ('pcd', 'Pessoa com deficiência'),
  ('servidor_if', 'Servidor do Instituto Federal');

-- 3. Adicionar quota_id na tabela candidates
ALTER TABLE candidates
ADD COLUMN quota_id INTEGER,
ADD CONSTRAINT fk_quota
  FOREIGN KEY (quota_id)
  REFERENCES quotas(id);


ALTER TABLE candidates
ALTER COLUMN name DROP NOT NULL;