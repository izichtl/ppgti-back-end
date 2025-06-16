-- INSERT

-- Processo Seletivo para o PPGTI - IFPB
INSERT INTO public.selection_processes (
  title,
  description,
  start_date,
  end_date,
  application_deadline,
  result_date,
  documents_required,
  evaluation_criteria,
  contact_info,
  status,
  program,
  year,
  semester
) VALUES (
  'Seleção PPGTI 2025.1',
  'Processo seletivo para o Programa de Pós-Graduação em Tecnologia da Informação - IFPB, com ênfase em Ciência de Dados, IoT e áreas correlatas.',
  '2025-03-10',
  '2025-04-30',
  '2025-04-15',
  '2025-05-10',
  '[
    "Cópia do diploma de graduação",
    "Currículo Lattes atualizado",
    "Projeto de pesquisa",
    "Comprovante de pagamento da taxa de inscrição"
  ]'::jsonb,
  'Análise curricular, projeto de pesquisa e entrevista.',
  'contato.ppgti@ifpb.edu.br',
  'published',
  'PPGTI - IFPB',
  '2025',
  '1'
);

-- Processo Seletivo para o Programa de Pós-Graduação em Engenharia Elétrica
INSERT INTO public.selection_processes (
  title,
  description,
  start_date,
  end_date,
  application_deadline,
  result_date,
  documents_required,
  evaluation_criteria,
  contact_info,
  status,
  program,
  year,
  semester
) VALUES (
  'Seleção Engenharia Elétrica 2025.1',
  'Processo seletivo para o Programa de Pós-Graduação em Engenharia Elétrica, com foco em sistemas de potência, eletrônica e controle.',
  '2025-03-20',
  '2025-05-05',
  '2025-04-20',
  '2025-05-15',
  '[
    "Diploma de graduação em Engenharia ou áreas afins",
    "Histórico escolar",
    "Currículo Lattes",
    "Carta de recomendação",
    "Projeto de pesquisa"
  ]'::jsonb,
  'Análise do projeto, currículo e entrevista técnica com banca avaliadora.',
  'selecao.eng.eletrica@ifpb.edu.br',
  'published',
  'Engenharia Elétrica - IFPB',
  '2025',
  '1'
);


-- Linhas de pesquisa para o processo 4 (PPGTI)
INSERT INTO research_lines (process_id, name)
VALUES 
  (4, 'Ciência de Dados e Inteligência Artificial'),  -- id = 1 (assumido)
  (4, 'Redes e Sistemas Distribuídos'),               -- id = 2
  (4, 'Engenharia de Software e Sistemas');           -- id = 3

-- Temas para linha 1
INSERT INTO research_topics (line_id, name)
VALUES 
  (1, 'Mineração de Dados'),
  (1, 'Aprendizado de Máquina'),
  (1, 'Processamento de Linguagem Natural');

-- Temas para linha 2
INSERT INTO research_topics (line_id, name)
VALUES 
  (2, 'Internet das Coisas (IoT)'),
  (2, 'Computação em Nuvem'),
  (2, 'Redes Veiculares');

-- Temas para linha 3
INSERT INTO research_topics (line_id, name)
VALUES 
  (3, 'Arquitetura de Software'),
  (3, 'DevOps e Integração Contínua'),
  (3, 'Testes Automatizados');

