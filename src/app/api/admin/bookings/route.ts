import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../auth/mongodb";
import Booking from "@/models/bookingModel";
import Service from "@/models/serviceModel";
Service;
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // Server-side admin check
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  function parseTime12h(timeStr: string) {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  }

  try {
    const bookings = await Booking.find({ paymentStatus: { $ne: "cancelled" } })
      .populate({ path: "service", select: "name" })
      .populate({ path: "userId", select: "name email" })
      .sort({ date: -1 });

    // Map to event format for FullCalendar
    const events = bookings.map((b: any) => {
      let start = b.date;
      if (b.time) {
        const dateObj = new Date(b.date);
        const parsed = parseTime12h(b.time);
        if (parsed) {
          dateObj.setHours(parsed.hours, parsed.minutes, 0, 0);
          start = dateObj.toISOString();
        } else {
          start = new Date(b.date).toISOString();
        }
      }
      return {
        id: b._id,
        title: b.service?.name || b.userId?.name || "Booking",
        start,
        user: b.userId?.name || undefined,
        service: b.service?.name || undefined,
        paymentStatus: b.paymentStatus, // Ensure status is included
      };
    });

    return NextResponse.json({ bookings: events });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
