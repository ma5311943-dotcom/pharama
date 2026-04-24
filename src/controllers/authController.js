import User from '@/models/User';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const register = async (req) => {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, password } = body;
    console.log("Registration attempt for:", email);

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Registration failed: User already exists");
      return Response.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"PharmaEase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Registration OTP',
        text: `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    console.log("User registered successfully, OTP sent:", email);
    return Response.json({ message: 'OTP sent to your email. Please verify to complete registration.', email }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const login = async (req) => {
  await dbConnect();
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"PharmaEase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Login OTP',
        text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return Response.json({
      message: 'OTP sent to your email. Please verify to login.',
      requireOtp: true,
      email
    }, { status: 200 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const updateProfile = async (req) => {
  await dbConnect();
  try {
    const { name, email, userId } = await req.json();

    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return Response.json({ message: 'Email already in use' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const verifyOtp = async (req) => {
  await dbConnect();
  try {
    const body = await req.json();
    const { email, otp } = body;
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.otp !== cleanOtp || user.otpExpires < new Date()) {
      return Response.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    user.password = undefined;

    return Response.json({
      message: 'Verified and logged in successfully',
      token,
      user
    }, { status: 200 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
