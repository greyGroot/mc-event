import { NextRequest, NextResponse } from "next/server";
import { getGuestById } from "@/lib/db";
import {
  generatePasskitPassBuffer,
  buildPasskitStructure,
  buildGoogleWalletPass,
  generateGoogleWalletJwtUrl,
} from "@/lib/passkit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> | { guestId: string } }
) {
  try {
    const resolvedParams = await params;
    let guestId = resolvedParams?.guestId;

    // Handle query parameter fallbacks (e.g. /api/wallet/pass?id=MC-VIP-123456)
    const searchParams = request.nextUrl.searchParams;
    const queryId = searchParams.get("id");

    if (!guestId || guestId === "pass" || guestId === "download") {
      if (queryId) {
        guestId = queryId;
      }
    }

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID is required to generate wallet pass." },
        { status: 400 }
      );
    }

    // Retrieve guest data via getGuestById helper
    const guest = await getGuestById(guestId);

    if (!guest) {
      return NextResponse.json(
        { error: `Guest with ID ${guestId} was not found.` },
        { status: 404 }
      );
    }

    // Check if JSON payload or Google Wallet URL format is requested
    const format = searchParams.get("format") || searchParams.get("type");
    const acceptHeader = request.headers.get("accept") || "";

    if (format === "json" || acceptHeader.includes("application/json")) {
      const googleWalletUrl = generateGoogleWalletJwtUrl(guest);
      const googleWalletPass = buildGoogleWalletPass(guest);
      const passkitStructure = buildPasskitStructure(guest);

      return NextResponse.json({
        success: true,
        guestId: guest.id,
        guest,
        googleWalletSaveUrl: googleWalletUrl,
        googleWalletPass,
        passkitStructure,
      });
    }

    // Generate Passkit pass buffer
    const passBuffer = await generatePasskitPassBuffer(guest);

    // Return Response with .pkpass attachment
    return new NextResponse(new Uint8Array(passBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="Mastercard_VIP_${guest.id}.pkpass"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("API wallet route error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate digital wallet pass",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
