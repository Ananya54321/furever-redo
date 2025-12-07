import { db } from "../../../../db/actions";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const result = await db.sendChat(data);

    return NextResponse.json({ status: 200, message: "success", result });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        statusText: "Internal Server Error",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
