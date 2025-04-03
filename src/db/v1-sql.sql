CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
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
    title VARCHAR(255),
    graduation_course VARCHAR(255),
    graduation_year VARCHAR(4),
    graduation_institution VARCHAR(255),
    specialization_course VARCHAR(255),
    specialization_year VARCHAR(4),
    specialization_institution VARCHAR(255),
    lattes_link VARCHAR(255)
);

CREATE TABLE candidate_documents (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(20) NOT NULL,
    _formulario_pontuacao_ VARCHAR(255),
    _diploma_certificado_ VARCHAR(255),
    _historico_graducao_ VARCHAR(255),
    _quitacao_eleitoral_ VARCHAR(255),
    _comprovante_residencia_ VARCHAR(255),
    _quitacao_militar_ VARCHAR(255),
    _declaracao_cota_ingresso_ VARCHAR(255),
    _declaracao_cota_servidor_ VARCHAR(255),
    _identidade_cpf_ VARCHAR(255),
    FOREIGN KEY (cpf) REFERENCES candidates (cpf) ON DELETE CASCADE
);

ALTER TABLE candidate_documents ADD CONSTRAINT unique_cpf UNIQUE (cpf);

