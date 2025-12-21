import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// User modeli
const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  pass: String,
  role: String,
  progress: { type: Number, default: 0 }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Ma'lumotlarni bazadan olish (O'quvchilar ro'yxati uchun)
export async function GET() {
  await dbConnect();
  const users = await User.find({ role: 'student' });
  return NextResponse.json(users);
}

// Ro'yxatdan o'tkazish
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newUser = await User.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik! Raqam band bo'lishi mumkin." }, { status: 400 });
  }
}