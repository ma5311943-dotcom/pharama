import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');
  
  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(payload);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await dbConnect();
        
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: 'Confirmed' },
          { new: true }
        );

        if (!updatedOrder) {
          console.error("Webhook: Order not found for ID:", orderId);
        } else {
          console.log(`Webhook: Order ${orderId} successfully confirmed via Stripe!`);
        }
      } catch (dbError) {
        console.error("Webhook: Database update failed:", dbError.message);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
      }
    } else {
      console.warn("Webhook: No orderId metadata found in Stripe Session");
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
