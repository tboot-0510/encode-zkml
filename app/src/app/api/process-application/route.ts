import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    console.log("data", data);

    // here do the ML prediction and generate the proof

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
