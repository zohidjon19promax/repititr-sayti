import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

// O'QUVCHILARNI OLISH (GET)
export async function GET() {
  try {
    const client = await clientPromise; // Tiplash shart emas, promise o'zi tayyor keladi
    const db = client.db("repetitor_db");

    const students = await db
      .collection("students")
      .find({})
      .sort({ addedDate: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: students });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "Ma'lumotlarni yuklashda xatolik: " + e.message },
      { status: 500 }
    );
  }
}

// YANGI O'QUVCHI QO'SHISH (POST)
// Request o'rniga NextRequest ishlatsangiz Next.js imkoniyatlaridan to'liq foydalanasiz
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");
    
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Ism va telefon raqami kiritilishi shart!" },
        { status: 400 }
      );
    }

    const newStudent = {
      ...body,
      addedDate: new Date().toISOString(),
      balance: body.balance || 0,
      status: body.status || 'active'
    };

    const result = await db.collection("students").insertOne(newStudent);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "O'quvchi muvaffaqiyatli qo'shildi" 
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "Server xatosi: " + e.message },
      { status: 500 }
    );
  }
}