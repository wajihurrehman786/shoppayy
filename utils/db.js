import { config } from "dotenv";
import mongoose, { mongo } from "mongoose";
require("dotenv").config({ path: "../envFolder/all.env" });
const DATABASEE =
  "mongodb+srv://m74jj1:mKzDS3FmYntiW9Zx@cluster0.hkaanj0.mongodb.net/shoppayy?retryWrites=true&w=majority";
const connection = {};

export async function connectDb() {
  if (connection.isConnected) {
    console.log("Already connected to the database.");
    return;
  }
  mongoose.set("strictQuery", false);

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Use previous connection to the database.");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("New connection to the database.");
  connection.isConnected = db.connections[0].readyState;
}

export async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_END === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnecting from the database.");
    }
  }
}
console.log(
  "🚀 ~ file: db.js:24 ~ connectDb ~ process.env.DATABASE",
  process.env.MONGODB_URI
);
const db = { connectDb, disconnectDb };
export default db;
