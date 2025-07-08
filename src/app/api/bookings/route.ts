import dbConnect from "../auth/mongodb";
import Booking from "@/models/bookingModel";
import Service from "@/models/serviceModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "../auth/mongodb";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  let query: any = {};

  if (session && session.user && session.user.id) {
    query.userId = session.user.id;
  } else if (userId) {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      query.userId = userId;
    } else {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
  } else if (email) {
    query.email = email;
  } else {
    return NextResponse.json(
      { error: "Missing userId or email" },
      { status: 400 }
    );
  }
  // Only show non-cancelled bookings
  query.paymentStatus = { $ne: "cancelled" };

  try {
    await clientPromise;
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate({ path: "service", select: "name price" })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return NextResponse.json({ bookings, total });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
