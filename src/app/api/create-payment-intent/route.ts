import { NextRequest, NextResponse } from "next/server";
import stripe from "../stripe";

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
