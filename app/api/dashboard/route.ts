import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    if (!userId) return NextResponse.json({ success: false }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("repetitor_db");

    let dashboardData = {};

    if (role === 'teacher') {
      const totalStudents = await db.collection("users").countDocuments({ role: 'student' });
      // Bu yerda boshqa hisob-kitoblarni ham qo'shish mumkin
      dashboardData = {
        totalStudents,
        activeLessons: 6, // Buni schedules bazasidan sanash kerak
        debtors: 0,
        rating: 4.9
      };
    } else if (role === 'parent') {
      // Ota-ona uchun uning farzandini topamiz (phone orqali bog'langan deb hisoblasak)
      const parent = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      const child = await db.collection("users").findOne({ role: 'student', parentPhone: parent.phone });
      
      dashboardData = {
        childName: child?.fullName || "Topilmadi",
        attendance: "88%",
        paymentStatus: "To'langan",
        balance: 0
      };
    }

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}