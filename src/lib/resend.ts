import { Resend } from "resend";
import { Guest } from "@/types";

export interface SendEmailResult {
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  reason?: string;
  error?: string;
}

/**
 * Sends a VIP Confirmation Email with the attached PDF ticket using Resend.
 * Handles missing API keys and network errors gracefully without crashing registration.
 * 
 * @param guest Guest object containing recipient details
 * @param pdfBuffer Buffer containing the generated PDF ticket
 */
export async function sendTicketEmail(
  guest: Guest,
  pdfBuffer: Buffer
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.warn(
      `[Resend Warning] RESEND_API_KEY is not defined. Email delivery skipped for guest ${guest.id} (${guest.email}).`
    );
    return {
      success: false,
      skipped: true,
      reason: "RESEND_API_KEY environment variable is not configured.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Mastercard VIP Events <onboarding@resend.dev>";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [guest.email],
      subject: `Your Mastercard VIP Access Pass - ${guest.firstName} ${guest.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 30px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #FF5F00; font-size: 24px; margin-bottom: 5px;">Mastercard VIP Access Pass</h1>
            <p style="color: #a0a0a0; font-size: 14px;">Official Registration Confirmation</p>
          </div>
          
          <div style="background-color: #171717; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; margin: 0 0 10px 0;">Dear <strong>${guest.firstName} ${guest.lastName}</strong>,</p>
            <p style="font-size: 14px; color: #d0d0d0; line-height: 1.5; margin: 0 0 15px 0;">
              Thank you for registering for the Mastercard VIP Executive Experience. Your access pass has been generated and is attached to this email as a PDF document.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
              <tr>
                <td style="color: #888; padding: 4px 0;">Pass ID:</td>
                <td style="color: #F79E1B; font-weight: bold; font-family: monospace;">${guest.id}</td>
              </tr>
              <tr>
                <td style="color: #888; padding: 4px 0;">Company:</td>
                <td style="color: #fff;">${guest.company}</td>
              </tr>
              <tr>
                <td style="color: #888; padding: 4px 0;">Position:</td>
                <td style="color: #fff;">${guest.position}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; color: #888888; font-size: 12px; margin-top: 20px;">
            <p>Please present your attached PDF ticket or QR code upon arrival at the Mastercard Terminal.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/api/wallet/${guest.id}" style="background-color: #171717; border: 1px solid #F79E1B; color: #F79E1B; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
              💾 Save to Android Wallet
            </a>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `ticket_${guest.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (emailResponse.error) {
      console.warn(`[Resend Warning] Failed to send email to ${guest.email}:`, emailResponse.error);
      return {
        success: false,
        error: emailResponse.error.message,
      };
    }

    console.log(`[Resend Success] Confirmation email sent successfully to ${guest.email} (ID: ${emailResponse.data?.id})`);
    return {
      success: true,
      messageId: emailResponse.data?.id,
    };
  } catch (error) {
    console.warn(`[Resend Error] Exception sending email to ${guest.email}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
