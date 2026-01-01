import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, message: "Telefon raqami topilmadi" });
    }

    const client = await (clientPromise as Promise<MongoClient>);
    const db = client.db("repetitor_db");

    // Muhim: O'quvchilar (students) kolleksiyasidan parentPhone orqali qidiramiz
    const child = await db.collection("students").findOne({ parentPhone: phone });

    if (!child) {
      return NextResponse.json({ success: false, message: "Farzand ma'lumotlari topilmadi" });
    }

    return NextResponse.json({ success: true, child });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}