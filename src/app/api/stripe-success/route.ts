import { NextRequest, NextResponse } from "next/server";
import stripe from "../stripe";
import clientPromise from "../auth/mongodb";
import Booking from "../../../models/bookingModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Fetch the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Connect to DB
    await clientPromise;

    // Check if booking already exists for this session
    const existing = await Booking.findOne({ stripeSessionId: session_id });
    if (existing) {
      return NextResponse.json({ booking: existing });
    }

    // Create booking using metadata
    const bookingData: any = {
      service: session.metadata?.service,
      serviceName: session.metadata?.serviceName,
      date: session.metadata?.date,
      time: session.metadata?.time,
      name: session.metadata?.name,
      email: session.metadata?.email,
      price: session.amount_total ? session.amount_total / 100 : undefined,
      paymentStatus: "paid",
      stripeSessionId: session_id,
    };
    if (mongoose.Types.ObjectId.isValid(session.metadata?.userId || "")) {
      bookingData.userId = session.metadata?.userId;
    }
    const booking = await Booking.create(bookingData);

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
