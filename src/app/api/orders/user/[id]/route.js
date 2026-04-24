import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching user orders' }, { status: 500 });
  }
}
