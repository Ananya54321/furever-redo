import Event from "@/../db/schema/event.schema";
import { connectToDatabase } from "@/../db/dbConfig";
import { NextResponse } from "next/server";
import { getUserByToken } from "@/../actions/userActions";

connectToDatabase();

export async function GET(request) {
  try {
    const upcomingEvents = await Event.find().sort({ eventDate: 1 }).lean();
    return NextResponse.json({
      success: true,
      message: "Events fetched successfully",
      events: upcomingEvents,
    });
  } catch (err) {
    console.error("Error in GET events:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();
  const { eventData, token } = body;
  const response = await getUserByToken(token, "user");
  if (!response.success) {
    return NextResponse.json(
      { success: false, error: response.message },
      { status: 401 }
    );
  }
  const user = response.user;
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User not found",
      },
      { status: 400 }
    );
  }
  try {
    const event = new Event({
      ...eventData,
      organisedBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await event.save();
    return NextResponse.json({
      success: true,
      message: "New event added successfully",
    });
  } catch (err) {
    console.error("Error in POST event:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;
    
    if (!userToken) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please login." }, { status: 401 });
    }

    let userId;
    try {
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(userToken, process.env.JWT_USER_SECRET);
      userId = decoded.id;
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return NextResponse.json({ success: false, error: "Invalid token. Please login again." }, { status: 401 });
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const isInterested = event.interested.includes(userId);

    if (isInterested) {
      event.interested.pull(userId);
    } else {
      event.interested.push(userId);
    }

    await event.save();

    return NextResponse.json({
      success: true,
      message: isInterested ? "Removed from interested" : "Added to interested",
      interested: event.interested,
      isInterested: !isInterested
    });
  } catch (err) {
    console.error("Error toggling interest:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Failed to update interest. Please try again." 
    }, { status: 500 });
  }
}
