import Event from "@/../db/schema/event.schema";
import { connectToDatabase } from "@/../db/dbConfig";
import { NextResponse } from "next/server";

connectToDatabase();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const event = await Event.findById(id)
      .populate('organisedBy', 'name email')
      .lean();
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
