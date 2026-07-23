import { NextResponse, NextRequest } from "next/server";
import { getAllGuests } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const expectedPassword = process.env.HOSTESS_PASSWORD || "mastercard2026";

    // 1. Check query parameter ?password=...
    const url = new URL(request.url);
    const queryPassword = url.searchParams.get("password");

    // 2. Check auth header
    const authHeader = request.headers.get("authorization");
    let bearerToken: string | null = null;
    if (authHeader) {
      if (authHeader.toLowerCase().startsWith("bearer ")) {
        bearerToken = authHeader.substring(7).trim();
      } else {
        bearerToken = authHeader.trim();
      }
    }

    // 3. Check custom header x-hostess-password
    const headerPassword = request.headers.get("x-hostess-password");

    const providedPassword = queryPassword || bearerToken || headerPassword;

    if (!providedPassword || providedPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const guests = await getAllGuests();

    return NextResponse.json({ guests }, { status: 200 });
  } catch (error) {
    console.error("API hostess guests error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve guest list",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
