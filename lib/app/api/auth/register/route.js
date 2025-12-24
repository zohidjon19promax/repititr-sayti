import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");
    const body = await req.json();

    // 1. Avval foydalanuvchi bor-yo'qligini tekshiramiz
    const existingUser = await db.collection("users").findOne({ phone: body.phone });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Bu raqam allaqachon mavjud!" }, { status: 400 });
    }

    // 2. Yangi foydalanuvchini qo'shamiz
    const result = await db.collection("users").insertOne({
      name: body.name,
      phone: body.phone,
      password: body.password, // Real loyihada parolni bcrypt bilan shifrlash kerak
      role: body.role,
      avatarColor: body.avatarColor,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      user: { _id: result.insertedId, name: body.name, phone: body.phone, role: body.role } 
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}