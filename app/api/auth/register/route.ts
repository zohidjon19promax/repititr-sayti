import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs"; // Parollarni shifrlash uchun

/**
 * Ro'yxatdan o'tish API:
 * Foydalanuvchi ma'lumotlarini xavfsiz tarzda bazaga saqlaydi.
 */
export async function POST(req: Request) {
  try {
    // 1. Ma'lumotlar bazasiga ulanish
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // 2. Kelayotgan ma'lumotlarni o'qish
    const body = await req.json();
    const { fullName, phone, password, role } = body;

    // 3. Oddiy validatsiya
    if (!fullName || !phone || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Barcha maydonlarni to'ldiring!" },
        { status: 400 }
      );
    }

    // Telefon raqamini faqat raqamlardan iborat holatga keltirish (tozalash)
    const cleanPhone = phone.replace(/\D/g, '');

    // 4. Bazada bu raqam borligini tekshirish ("users" kolleksiyasidan)
    const existingUser = await db.collection("users").findOne({ phone: cleanPhone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu telefon raqami allaqachon ro'yxatdan o'tgan!" },
        { status: 400 }
      );
    }

    // 5. Parolni shifrlash (Haqiqiy xavfsizlik uchun)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Yangi foydalanuvchini saqlash
    // Ota-ona, o'qituvchi va talaba - barchasi "users" kolleksiyasiga tushadi
    const result = await db.collection("users").insertOne({
      fullName: fullName.trim(),
      phone: cleanPhone,
      password: hashedPassword, // Shifrlangan parol
      role: role, // 'teacher', 'student' yoki 'parent'
      createdAt: new Date(),
      status: "active"
    });

    // 7. Muvaffaqiyatli javob qaytarish
    return NextResponse.json({ 
      success: true, 
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz!",
      id: result.insertedId 
    });

  } catch (e: any) {
    console.error("Register API Error:", e);
    return NextResponse.json(
      { success: false, message: "Serverda xatolik yuz berdi: " + e.message }, 
      { status: 500 }
    );
  }
}