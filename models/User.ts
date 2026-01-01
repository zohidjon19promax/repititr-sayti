import mongoose from "mongoose";

// Foydalanuvchi ma'lumotlari strukturasi
const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, "Ism sharifingizni kiriting"] 
  },
  phone: { 
    type: String, 
    required: [true, "Telefon raqamingizni kiriting"], 
    unique: true // Bir xil raqam bilan ikki marta ro'yxatdan o'tib bo'lmaydi
  },
  password: { 
    type: String, 
    required: [true, "Parol kiriting"] 
  },
  role: { 
    type: String, 
    enum: ["teacher", "student"], // Faqat shu ikki roldan biri bo'lishi shart
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Agar model oldin yaratilgan bo'lsa o'shani ishlat, bo'lmasa yangi yarat
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;