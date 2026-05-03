import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { email, name, faceDescriptor, image } = await req.json();

    if (!email || !name || !faceDescriptor || !image) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'pharmacy/face-auth',
    });

    const user = await User.create({
      name,
      email,
      faceDescriptor,
      faceImage: uploadResponse.secure_url,
      isVerified: true,
    });

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

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Face Register Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
