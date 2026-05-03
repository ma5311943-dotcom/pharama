import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const euclideanDistance = (desc1, desc2) => {
  if (desc1.length !== desc2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
};

export async function POST(req) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { email, faceDescriptor } = await req.json();

    if (!email || !faceDescriptor) {
      return NextResponse.json({ success: false, message: 'Email and face scan are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !user.faceDescriptor || user.faceDescriptor.length === 0) {
      return NextResponse.json({ success: false, message: 'No face data found for this email' }, { status: 404 });
    }

    const distance = euclideanDistance(faceDescriptor, user.faceDescriptor);

    if (distance > 0.55) {
      return NextResponse.json({ success: false, message: 'Face not recognized' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      faceImage: user.faceImage,
    };

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Face Login Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
