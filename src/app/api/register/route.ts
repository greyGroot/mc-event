import { NextResponse } from "next/server";
import { z } from "zod";
import { saveGuest } from "@/lib/db";
import { generateQRCodeDataUrl } from "@/lib/qrcode";
import { generatePDFTicketBuffer } from "@/lib/pdf";
import { sendTicketEmail } from "@/lib/resend";

// Input validation schema using Zod
const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  company: z.string().min(1, "Company name is required").trim(),
  position: z.string().min(1, "Position / Title is required").trim(),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate input body with Zod
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, company, position, email } = validationResult.data;

    // 2. Save guest to Firestore 'guests' collection via helper
    const guest = await saveGuest({
      firstName,
      lastName,
      company,
      position,
      email,
    });

    // 3. Generate QR code Data URL
    const qrCodeDataUrl = await generateQRCodeDataUrl(guest.id);

    // 4. Generate PDF ticket Buffer
    const pdfBuffer = await generatePDFTicketBuffer(guest, qrCodeDataUrl);

    // 5. Attempt Resend email delivery with attached PDF ticket
    await sendTicketEmail(guest, pdfBuffer);

    // 6. Return standard success JSON response
    return NextResponse.json(
      {
        success: true,
        guestId: guest.id,
        guest,
        qrCodeDataUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API register error:", error);
    return NextResponse.json(
      {
        error: "Failed to process VIP guest registration",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
