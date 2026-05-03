import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.wishlist });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ success: false, message: 'User ID and Product ID are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    let message = '';

    if (index > -1) {

      user.wishlist.splice(index, 1);
      message = 'Removed from favorites';
    } else {

      user.wishlist.push(productId);
      message = 'Added to favorites';
    }

    await user.save();

    const updatedUser = await User.findById(userId).populate('wishlist');

    return NextResponse.json({ 
      success: true, 
      message, 
      data: updatedUser.wishlist 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
