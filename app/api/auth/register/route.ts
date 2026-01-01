import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

/**
 * Ro'yxatdan o'tish API:
 * Foydalanuvchi ma'lumotlarini qabul qiladi va bazaga saqlaydi.
 */
export async function POST(req: Request) {
  try {
    // 1. Ma'lumotlar bazasiga ulanish
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // 2. Kelayotgan ma'lumotlarni o'qish
    const body = await req.json();
    const { fullName, phone, password, role } = body;

    // 3. Oddiy validatsiya (Ma'lumotlar to'liqligini tekshirish)
    if (!fullName || !phone || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Barcha maydonlarni to'ldiring!" },
        { status: 400 }
      );
    }

    // 4. Bazada bu raqam borligini tekshirish
    const existingUser = await db.collection("users").findOne({ phone: phone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu telefon raqami allaqachon ro'yxatdan o'tgan!" },
        { status: 400 }
      );
    }

    // 5. Yangi foydalanuvchini saqlash
    const result = await db.collection("users").insertOne({
      fullName,
      phone,
      password, // Real loyihada bu yerda parolni hash qilish tavsiya etiladi (masalan: bcrypt)
      role,
      createdAt: new Date(),
      status: "active" // Foydalanuvchi holati
    });

    // 6. Muvaffaqiyatli javob qaytarish
    return NextResponse.json({ 
      success: true, 
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz!",
      id: result.insertedId 
    });

  } catch (e: any) {
    // Xatolik yuz bersa konsolga chiqarish va foydalanuvchiga xabar berish
    console.error("Register Error:", e);
    return NextResponse.json(
      { success: false, error: "Serverda ichki xatolik yuz berdi: " + e.message }, 
      { status: 500 }
    );
  }
}