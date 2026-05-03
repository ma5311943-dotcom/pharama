import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7';

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const revenueData = await Order.aggregate([
      { $match: { status: { $nin: ['Pending', 'Cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    let startDate = new Date();
    if (range === '30') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === 'all') {
      startDate = new Date(0);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: ['Pending', 'Cancelled'] } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('userName totalAmount status createdAt');

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue
      },
      dailyRevenue,
      latestOrders
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
