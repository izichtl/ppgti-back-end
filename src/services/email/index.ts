import resend from '../../resend';
import { render } from '@react-email/render';
import { RegistrationConfirmationEmail } from '../../templates';

interface SendRegistrationConfirmationParams {
  to: string;
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

export const sendRegistrationConfirmation = async ({
  to,
  candidateName,
  processTitle,
  applicationDate,
  applicationId,
  processDetails,
}: SendRegistrationConfirmationParams) => {
  try {
    const emailHtml = await render(
      RegistrationConfirmationEmail({
        candidateName,
        processTitle,
        applicationDate,
        applicationId,
        processDetails,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: 'PPGTI <noreply@ppgti.ifpb.edu.br>',
      to: [to],
      subject: `Confirmação de Inscrição - ${processTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendRegistrationConfirmation:', error);
    throw error;
  }
};
