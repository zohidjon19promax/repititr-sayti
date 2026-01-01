import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * Login API:
 * Foydalanuvchi ma'lumotlarini tekshiradi va sessiya uchun ma'lumot qaytaradi.
 */
export async function POST(req: Request) {
  try {
    // 1. Ma'lumotlar bazasiga ulanish
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // 2. So'rov tanasini (body) xavfsiz o'qish
    const body = await req.json();
    const { phone, password, role } = body;

    // 3. Validatsiya - Ma'lumotlar kelganini tekshirish
    if (!phone || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Telefon, parol va rolni kiriting!" },
        { status: 400 }
      );
    }

    // Telefon raqamini tozalash (faqat raqamlar: +998 90 123 45 67 -> 998901234567)
    const cleanPhone = phone.replace(/\D/g, "");

    // 4. Foydalanuvchini bazadan qidirish (Roli bilan birga)
    const user = await db.collection("users").findOne({ 
      phone: cleanPhone, 
      role: role 
    });

    // 5. Agar foydalanuvchi topilmasa
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Bunday telefon raqamli foydalanuvchi topilmadi yoki tanlangan rol noto'g'ri!" 
        },
        { status: 404 }
      );
    }

    // 6. Parolni bcrypt orqali tekshirish
    // user.password — bu bazadagi shifrlangan qator
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Kiritilgan parol noto'g'ri!" },
        { status: 401 }
      );
    }

    // 7. Muvaffaqiyatli kirish - Foydalanuvchi ma'lumotlarini tayyorlash
    // Parolni xavfsizlik yuzasidan foydalanuvchiga qaytarmaslik kerak
    const { password: _, _id, ...safeUserData } = user;

    return NextResponse.json({
      success: true,
      message: "Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.",
      user: {
        id: _id.toString(), // MongoDB ObjectId'sini stringga o'tkazamiz
        ...safeUserData
      }
    });

  } catch (error: any) {
    // Xatolikni konsolga yozish (debugging uchun)
    console.error("CRITICAL LOGIN ERROR:", error);

    return NextResponse.json(
      { 
        success: false, 
        message: "Serverda texnik xatolik yuz berdi. Iltimos, keyinroq urunib ko'ring." 
      },
      { status: 500 }
    );
  }
}