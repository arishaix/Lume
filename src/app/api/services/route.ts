import dbConnect from "../auth/mongodb";
import Service from "@/models/serviceModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const services = await Service.find({});
  return NextResponse.json({ services });
}
