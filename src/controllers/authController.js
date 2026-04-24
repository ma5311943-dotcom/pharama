import User from '@/models/User';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User registered successfully:", email);
    return Response.json({ message: 'User registered successfully', user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const login = async (req) => {
  await dbConnect();
  try {
    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Remove password from response
    user.password = undefined;

    return Response.json({
      message: 'Logged in successfully',
      token,
      user
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
