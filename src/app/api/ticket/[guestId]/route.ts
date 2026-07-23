import { NextRequest, NextResponse } from "next/server";
import { getGuestById } from "@/lib/db";
import { generateQRCodeDataUrl } from "@/lib/qrcode";
import { generatePDFTicketBuffer } from "@/lib/pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> | { guestId: string } }
) {
  try {
    const resolvedParams = await params;
    let guestId = resolvedParams?.guestId;

    // Handle fallback query parameter ?id=... (e.g., if /api/ticket/pdf?id=MC-VIP-xxx is requested)
    const searchParams = request.nextUrl.searchParams;
    const queryId = searchParams.get("id");

    if (!guestId || guestId === "pdf" || guestId === "download") {
      if (queryId) {
        guestId = queryId;
      }
    }

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID is required to download ticket." },
        { status: 400 }
      );
    }

    // Retrieve guest from Firestore db helper
    const guest = await getGuestById(guestId);

    if (!guest) {
      return NextResponse.json(
        { error: `Guest with ID ${guestId} was not found.` },
        { status: 404 }
      );
    }

    // Generate QR code and PDF ticket buffer
    const qrDataUrl = await generateQRCodeDataUrl(guest.id);
    const pdfBuffer = await generatePDFTicketBuffer(guest, qrDataUrl);

    // Return downloadable PDF response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Mastercard_VIP_Ticket_${guest.id}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("API ticket route error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate VIP PDF ticket",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
