import { MongoClient } from 'mongodb';

// MongoDB ulanish manzili (Siz yuborgan manzil saqlandi)
const uri = "mongodb+srv://admin:zohid2104@cluster0.7wlj02m.mongodb.net/repetitor_db?retryWrites=true&w=majority";

if (!uri) {
  throw new Error('Iltimos, MONGODB_URI ni tekshiring');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * Next.js rivojlanish jarayonida (development) har safar kod o'zgarganda 
 * yangi ulanish ochmasligi uchun global keshdan foydalanamiz.
 */
if (process.env.NODE_ENV === 'development') {
  // Global o'zgaruvchini TypeScript uchun e'lon qilamiz
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log("✅ MongoDB: Yangi ulanish yaratildi (Dev Mode)");
  } else {
    console.log("♻️ MongoDB: Mavjud ulanishdan foydalanilmoqda (Cache)");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production rejimida bitta doimiy ulanish kifoya
  client = new MongoClient(uri);
  clientPromise = client.connect();
  console.log("🚀 MongoDB: Production ulanish faollashtirildi");
}

// Boshqa fayllarda ishlatish uchun export qilamiz
export default clientPromise;