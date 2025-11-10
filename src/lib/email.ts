import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const client = getResendClient();
    const data = await client.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@university.edu',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export function generateVisitConfirmationEmail(visitRequest: {
  firstName: string;
  lastName: string;
  email: string;
  preferredDate: Date | string;
  preferredTime: string;
  visitType?: string;
  additionalInfo?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Visit Request Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Visit Request Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear ${visitRequest.firstName} ${visitRequest.lastName},</p>

          <p>Great news! Your visit request to our university has been approved. We're excited to welcome you to our campus.</p>

          <div class="details">
            <h3>Visit Details:</h3>
            <p><strong>Date:</strong> ${new Date(visitRequest.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${visitRequest.preferredTime}</p>
            <p><strong>Type:</strong> ${visitRequest.visitType}</p>
            ${visitRequest.additionalInfo ? `<p><strong>Additional Information:</strong> ${visitRequest.additionalInfo}</p>` : ''}
          </div>

          <p><strong>What to expect:</strong></p>
          <ul>
            <li>A campus tour guide will meet you at the main entrance</li>
            <li>Please bring a valid ID for check-in</li>
            <li>Feel free to ask questions during your visit</li>
          </ul>

          <p>If you need to reschedule or have any questions, please contact us at admissions@university.edu or call (555) 123-4567.</p>

          <p>We look forward to seeing you soon!</p>

          <p>Best regards,<br>
          Admissions Team<br>
          University Name</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}