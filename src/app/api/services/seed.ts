import dbConnect from "../auth/mongodb";
import Service from "@/models/serviceModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  // Remove existing services
  await Service.deleteMany({});
  // Add two services
  const services = await Service.insertMany([
    { name: "Makeup", price: 150, duration: 60 },
    { name: "Nails", price: 80, duration: 60 },
  ]);
  return NextResponse.json({ message: "Seeded services", services });
}
