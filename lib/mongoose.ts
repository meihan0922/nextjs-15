import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined.");
}

interface MongooseCache {
  conn: Mongoose | null; // 連線的結果
  promise: Promise<Mongoose> | null; // 非同步連線本身
}

declare global {
  // 故意使用 var ，mongoose 會變成全域變數
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// 如果沒有緩存，每次調用都有可能會創建新的資料庫連接，導致資源耗盡、達到連線的限制
// 使用單例模式寄放緩存
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbconnect = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
      })
      .then((result) => {
        console.log("✅ Connected to MongoDB!");
        return result;
      })
      .catch((err) => {
        console.error("⛔️ Error connecting to MongoDB");
        throw err;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbconnect;
