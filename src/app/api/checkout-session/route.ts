import { NextRequest, NextResponse } from "next/server";
import stripe from "../stripe";

export async function POST(req: NextRequest) {
  const { service, userId, serviceName, price, date, time, name, email } =
    await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Change currency if needed
            product_data: {
              name: serviceName,
            },
            unit_amount: price, // price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        service,
        userId,
        serviceName,
        date,
        time,
        name,
        email,
        price: String(price), // Ensure price is a string for Stripe metadata
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
