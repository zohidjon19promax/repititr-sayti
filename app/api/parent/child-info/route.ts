import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  try {
    // 1. URL dan ota-onaning telefon raqamini yoki ID sini olamiz
    const { searchParams } = new URL(req.url);
    const parentPhone = searchParams.get("phone");

    if (!parentPhone) {
      return NextResponse.json(
        { success: false, message: "Telefon raqami topilmadi" },
        { status: 400 }
      );
    }

    // 2. Bazaga ulanamiz
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    /**
     * 3. Farzand ma'lumotlarini qidirish.
     * Real tizimda ota-ona va talaba telefon raqami orqali bog'lanadi.
     * Bu yerda 'students' kolleksiyasidan ota-ona raqamiga mos keluvchi talabani qidiramiz.
     */
    const childData = await db.collection("students").findOne({ 
      parentPhone: parentPhone 
    });

    if (!childData) {
      return NextResponse.json({
        success: true,
        message: "Farzand ma'lumotlari hali ulanmagan",
        data: {
          name: "Topilmadi",
          attendance: "0%",
          balance: 0,
          status: "Noma'lum"
        }
      });
    }

    // 4. Ma'lumotlarni muvaffaqiyatli qaytaramiz
    return NextResponse.json({
      success: true,
      data: childData
    });

  } catch (e: any) {
    console.error("Parent API Error:", e);
    return NextResponse.json(
      { success: false, message: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}