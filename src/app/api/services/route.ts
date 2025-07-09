import dbConnect from "../auth/mongodb";
import Service from "@/models/serviceModel";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest) {
  await dbConnect();
  // Allow all users (including unauthenticated) to fetch services
  const services = await Service.find({});
  return NextResponse.json({ services });
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { serviceId, basicPrice, standardPrice, premiumPrice, duration } =
      await req.json();
    if (
      !serviceId ||
      basicPrice == null ||
      standardPrice == null ||
      premiumPrice == null ||
      duration == null
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const before = await Service.findById(serviceId);

    const updated = await Service.findByIdAndUpdate(
      serviceId,
      { basicPrice, standardPrice, premiumPrice, duration },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ service: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
