// import { MongoClient, ServerApiVersion } from "mongodb"; ndrv

import "dotenv/config";
import mongoose from "mongoose";

// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }, ntdrvr
// });

export async function connectToDatabase() {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URI); // no newurlprsr
    console.log("Connected to MongoDB!");

    // await client.db("users").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // return { database: client.db("users") };
  } catch (error) {
    console.log(error);
    return { database: null };
  }
}
