import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");
    const { phone, password } = await req.json();

    // Bazadan qidiramiz
    const user = await db.collection("users").findOne({ phone, password });

    if (!user) {
      return NextResponse.json({ success: false, message: "Telefon yoki parol xato!" }, { status: 401 });
    }

    // Parolni xavfsizlik uchun olib tashlaymiz
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}