import dbConnect from "../mongodb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password required" },
      { status: 400 }
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "client",
  });
  return NextResponse.json(
    {
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 }
  );
}
