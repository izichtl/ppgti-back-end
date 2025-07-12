import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';

interface RegistrationConfirmationEmailProps {
  candidateName: string;
  processTitle: string;
  applicationDate: string;
  applicationId: string;
  processDetails?: {
    startDate: string;
    endDate: string;
    resultDate?: string;
  };
}

export const RegistrationConfirmationEmail = ({
  candidateName,
  processTitle,
  applicationDate,
  applicationId,
  processDetails,
}: RegistrationConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmação de Inscrição - {processTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Confirmação de Inscrição</Heading>
          
          <Section style={section}>
            <Text style={text}>
              Olá <strong>{candidateName}</strong>,
            </Text>
            
            <Text style={text}>
              Sua inscrição no processo seletivo <strong>{processTitle}</strong> foi confirmada com sucesso!
            </Text>
            
            <Text style={text}>
              <strong>Detalhes da Inscrição:</strong>
            </Text>
            
            <Section style={infoSection}>
              <Text style={infoText}>
                <strong>Número da Inscrição:</strong> {applicationId}
              </Text>
              <Text style={infoText}>
                <strong>Data da Inscrição:</strong> {applicationDate}
              </Text>
              <Text style={infoText}>
                <strong>Processo Seletivo:</strong> {processTitle}
              </Text>
            </Section>
            
            {processDetails && (
              <>
                <Text style={text}>
                  <strong>Datas Importantes:</strong>
                </Text>
                <Section style={infoSection}>
                  <Text style={infoText}>
                    <strong>Início do Processo:</strong> {processDetails.startDate}
                  </Text>
                  <Text style={infoText}>
                    <strong>Fim do Processo:</strong> {processDetails.endDate}
                  </Text>
                  {processDetails.resultDate && (
                    <Text style={infoText}>
                      <strong>Divulgação dos Resultados:</strong> {processDetails.resultDate}
                    </Text>
                  )}
                </Section>
              </>
            )}
            
            <Hr style={hr} />
            
            <Text style={text}>
              <strong>Próximos Passos:</strong>
            </Text>
            <Text style={text}>
              1. Aguarde a verificação da documentação enviada
            </Text>
            <Text style={text}>
              2. Fique atento aos comunicados sobre homologação
            </Text>
            <Text style={text}>
              3. Em caso de dúvidas, entre em contato através do sistema
            </Text>
            
            <Hr style={hr} />
            
            <Text style={footerText}>
              Esta é uma mensagem automática. Por favor, não responda a este email.
            </Text>
            <Text style={footerText}>
              Para mais informações, acesse o sistema de inscrições.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const section = {
  padding: '0 48px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const infoSection = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
};

const infoText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
}; 