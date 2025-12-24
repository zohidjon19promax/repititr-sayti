// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:zohid2104@cluster0.7wlj02m.mongodb.net/repetitor_db?retryWrites=true&w=majority";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Iltimos, MongoDB URI manzilini tekshiring!');
}

if (process.env.NODE_ENV === 'development') {
  // Development rejimida global o'zgaruvchidan foydalanamiz
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production rejimida yangi client yaratamiz
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;