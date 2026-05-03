import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    await dbConnect();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users'
    }, { status: 500 });
  }
}

