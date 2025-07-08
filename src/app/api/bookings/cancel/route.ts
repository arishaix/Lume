import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Booking from "@/models/bookingModel";
import dbConnect from "../../auth/mongodb";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bookingId } = await req.json();
  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }
  const booking = await Booking.findOne({
    _id: bookingId,
    userId: new mongoose.Types.ObjectId(session.user.id),
  });
  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found or not yours" },
      { status: 404 }
    );
  }
  booking.paymentStatus = "cancelled";
  await booking.save();
  return NextResponse.json({ success: true });
}
