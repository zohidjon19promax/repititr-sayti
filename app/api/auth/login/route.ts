// app/api/auth/login/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
  try {
    // 1. Ma'lumotlar bazasiga ulanamiz
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // 2. Frontenddan kelgan telefon, parol va rolni olamiz
    // Rolni ham tekshirish kerak, chunki o'qituvchi o'quvchi bo'limiga kirib ketmasligi lozim
    const body = await req.json();
    const { phone, password, role } = body;

    // 3. Oddiy validatsiya
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "Telefon va parolni kiriting!" },
        { status: 400 }
      );
    }

    // 4. Bazadan foydalanuvchini telefon raqami VA roli bo'yicha qidiramiz
    const user = await db.collection("users").findOne({ 
      phone: phone,
      role: role // Rolni ham tekshirish xavfsizlikni oshiradi
    });

    // 5. Agar foydalanuvchi topilmasa
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Bunday foydalanuvchi topilmadi yoki rol xato!" },
        { status: 404 }
      );
    }

    // 6. Parolni tekshiramiz
    // Eslatma: Agar parollarni hash qilgan bo'lsangiz, bu yerda compare funksiyasi kerak bo'ladi
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Parol xato!" },
        { status: 401 }
      );
    }

    // 7. Hammasi to'g'ri bo'lsa, foydalanuvchi ma'lumotlarini qaytaramiz (parolni olib tashlab)
    // TypeScript xatoligini oldini olish uchun 'user'ni 'any' yoki maxsus interfeysga o'giramiz
    const { password: _, _id, ...userWithoutPassword } = user as any;
    
    return NextResponse.json({
      success: true,
      message: "Xush kelibsiz!",
      user: {
        id: _id.toString(), // MongoDB ID'sini string formatga o'tkazamiz
        ...userWithoutPassword
      }
    });

  } catch (e: any) {
    // Xatolik yuz bersa konsolga yozamiz
    console.error("Login Error:", e);
    return NextResponse.json(
      { success: false, message: "Serverda xatolik yuz berdi: " + e.message },
      { status: 500 }
    );
  }
}