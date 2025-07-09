import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../auth/mongodb";
import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import Service from "@/models/serviceModel";
Service; // Ensure Service model is registered
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // Server-side admin check
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments({});

    // Upcoming bookings (date in the future, paymentStatus 'paid')
    const now = new Date();
    const upcomingBookings = await Booking.countDocuments({
      date: { $gte: now },
      paymentStatus: "paid",
    });

    // Total revenue (sum of price for paid bookings)
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent bookings (latest 3 by creation time)
    const recentBookings = await Booking.find({})
      .sort({ _id: -1 }) // Sort by creation time, newest first
      .limit(3)
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "service", select: "name price" });

    return NextResponse.json({
      totalBookings,
      upcomingBookings,
      totalRevenue,
      recentBookings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
