import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs"; // Shifrlangan parolni tekshirish uchun

/**
 * Login API:
 * Foydalanuvchi telefon raqami, paroli va rolini tekshiradi.
 */
export async function POST(req: Request) {
  try {
    // 1. Ma'lumotlar bazasiga ulanamiz
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // 2. Frontenddan kelgan ma'lumotlarni olamiz
    const body = await req.json();
    const { phone, password, role } = body;

    // 3. Validatsiya
    if (!phone || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Telefon, parol va rolni tanlang!" },
        { status: 400 }
      );
    }

    // Telefon raqamini tozalash (faqat raqamlar qolishi uchun)
    const cleanPhone = phone.replace(/\D/g, '');

    // 4. Bazadan foydalanuvchini telefon raqami va roli bo'yicha qidiramiz
    const user = await db.collection("users").findOne({ 
      phone: cleanPhone,
      role: role 
    });

    // 5. Agar foydalanuvchi topilmasa
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Bunday foydalanuvchi topilmadi yoki tanlangan rol noto'g'ri!" },
        { status: 404 }
      );
    }

    // 6. Shifrlangan parolni tekshiramiz (Bcrypt yordamida)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Parol noto'g'ri!" },
        { status: 401 }
      );
    }

    // 7. Muvaffaqiyatli javob (parolni xavfsizlik uchun olib tashlaymiz)
    const { password: _, _id, ...userWithoutPassword } = user as any;
    
    return NextResponse.json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      user: {
        id: _id.toString(),
        ...userWithoutPassword
      }
    });

  } catch (e: any) {
    console.error("Login API Error:", e);
    return NextResponse.json(
      { success: false, message: "Serverda ichki xatolik yuz berdi." },
      { status: 500 }
    );
  }
}