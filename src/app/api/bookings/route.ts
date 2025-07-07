import dbConnect from "../auth/mongodb";
import Booking from "@/models/bookingModel";
import Service from "@/models/serviceModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { selectedServiceId, appointmentDate, appointmentTime } =
    await req.json();
  if (!selectedServiceId || !appointmentDate || !appointmentTime) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const serviceDoc = await Service.findById(selectedServiceId);
  if (!serviceDoc) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  const booking = await Booking.create({
    userId: session.user.id,
    service: serviceDoc._id,
    date: appointmentDate,
    time: appointmentTime,
    paymentStatus: "pending",
    status: "pending",
  });

  return NextResponse.json(
    {
      message: "Booking created successfully!",
      booking: {
        id: booking._id,
        service: serviceDoc.name,
        price: serviceDoc.price,
        date: appointmentDate,
        time: appointmentTime,
        userId: session.user.id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    },
    { status: 201 }
  );
}
