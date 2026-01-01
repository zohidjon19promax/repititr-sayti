import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

/**
 * Dars jadvalini olish va saqlash API
 */

// 1. Darslar jadvalini olish (GET)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");
    const groupName = searchParams.get("group"); // Talabalar uchun guruhi bo'yicha

    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    let query = {};

    // Rollarga qarab filtrlash mantiqi
    if (role === 'teacher' && userId) {
      // O'qituvchi faqat o'zi biriktirilgan darslarni ko'radi
      query = { teacherId: userId };
    } else if (role === 'student' && groupName) {
      // Talaba faqat o'z guruhi darslarini ko'radi
      query = { group: groupName };
    }

    const schedules = await db.collection("schedules")
      .find(query)
      .sort({ time: 1 }) // Vaqt bo'yicha tartiblash
      .toArray();

    return NextResponse.json({ success: true, data: schedules });

  } catch (e: any) {
    console.error("Schedule GET Error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// 2. Yangi dars qo'shish (POST) - Faqat o'qituvchilar uchun
export async function POST(req: Request) {
  try {
    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    const body = await req.json();
    const { subject, teacher, time, room, group, teacherId, dayOfWeek } = body;

    // Oddiy validatsiya
    if (!subject || !time || !group) {
      return NextResponse.json(
        { success: false, message: "Majburiy maydonlarni to'ldiring!" },
        { status: 400 }
      );
    }

    const newSchedule = {
      subject,
      teacher, // Ustoz ismi
      teacherId, // Ustozning bazadagi IDsi
      time, // Masalan: "14:00 - 15:30"
      room, // Xona nomi yoki "Online"
      group, // Qaysi guruh uchun dars
      dayOfWeek, // Haftaning qaysi kuni (Dushanba, Seshanba...)
      createdAt: new Date()
    };

    const result = await db.collection("schedules").insertOne(newSchedule);

    return NextResponse.json({ 
      success: true, 
      message: "Dars jadvalga qo'shildi!",
      data: { _id: result.insertedId, ...newSchedule }
    });

  } catch (e: any) {
    console.error("Schedule POST Error:", e);
    return NextResponse.json({ success: false, message: "Serverda xatolik" }, { status: 500 });
  }
}