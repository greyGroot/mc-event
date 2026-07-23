import { NextResponse } from "next/server";
import { checkInGuestInDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { guestId, password } = body;

    const expectedPassword = process.env.HOSTESS_PASSWORD || "mastercard2026";
    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid hostess password" },
        { status: 401 }
      );
    }

    if (!guestId || typeof guestId !== "string" || !guestId.trim()) {
      return NextResponse.json(
        { success: false, error: "Guest ID is required" },
        { status: 400 }
      );
    }

    const cleanGuestId = guestId.trim();
    const result = await checkInGuestInDb(cleanGuestId);

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("API hostess checkin error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during check-in",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
