import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";

// --- O'QUVCHILARNI OLISH (GET) ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");

    const students = await db
      .collection("students")
      .find({})
      .sort({ addedDate: -1 }) // Yangi qo'shilganlar tepada
      .toArray();

    return NextResponse.json({ 
      success: true, 
      count: students.length,
      data: students 
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "Ma'lumotlarni yuklashda xatolik: " + e.message },
      { status: 500 }
    );
  }
}

// --- YANGI O'QUVCHI QO'SHISH (POST) ---
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("repetitor_db");
    
    const body = await req.json();

    // 1. Validatsiya
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Ism va telefon raqami kiritilishi shart!" },
        { status: 400 }
      );
    }

    // 2. Takrorlanishni tekshirish
    const existingStudent = await db.collection("students").findOne({ phone: body.phone.trim() });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: "Ushbu telefon raqamli o'quvchi allaqachon mavjud!" },
        { status: 409 }
      );
    }

    // 3. Ma'lumotni shakllantirish
    const newStudent = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      group: body.group || "Guruhsiz",
      addedDate: new Date().toISOString(),
      balance: Number(body.balance) || 0,
      status: 'active',
      attendance: [] // Davomat sanalari uchun: ["2024-05-20", "2024-05-22"]
    };

    const result = await db.collection("students").insertOne(newStudent);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "O'quvchi muvaffaqiyatli qo'shildi" 
    }, { status: 201 });

  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "Server xatosi: " + e.message },
      { status: 500 }
    );
  }
}

// --- O'QUVCHINI O'CHIRISH (DELETE) ---
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
          return NextResponse.json({ success: false, error: "Yaroqsiz yoki topilmagan ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("repetitor_db");

        const result = await db.collection("students").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ success: true, message: "O'quvchi o'chirildi" });
        } else {
            return NextResponse.json({ success: false, error: "O'quvchi topilmadi" }, { status: 404 });
        }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// --- MA'LUMOTLARNI YANGILASH (PATCH) ---
// Davomat yoki Balansni o'zgartirish uchun
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "ID xato" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("repetitor_db");

    // Agar balans kelsa, uni raqamga o'tkazamiz
    if (updateData.balance !== undefined) {
      updateData.balance = Number(updateData.balance);
    }

    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Ma'lumotlar yangilandi",
      modifiedCount: result.modifiedCount 
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}