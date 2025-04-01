import Stripe from 'stripe';

export async function POST(req) {
  const { priceId } = await req.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 3,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  });

  return Response.json({ url: session.url });
}

