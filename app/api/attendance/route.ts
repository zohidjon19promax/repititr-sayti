import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");
    const attendance = await db.collection("attendance")
      .find({ studentId: studentId })
      .toArray();

    return NextResponse.json({ success: true, data: attendance });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Xatolik yuz berdi" }, { status: 500 });
  }
}