// import mongoose from "mongoose";

// // Function to connect to the database
// export async function connectToDatabase() {
//   if (mongoose.connection.readyState !== 1) {
//     try {
//       await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       console.log("Connected to MongoDB");
//     } catch (error) {
//       console.error("Error connecting to MongoDB:", error.message);
//       throw new Error("Database connection failed");
//     }
//   }
// }



// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();
// const MONGODB_URI = process.env.MONGO_URI;

// async function connectToDatabase() {
//     try {
//         await mongoose.connect(MONGODB_URI, {
//             connectTimeoutMS: 30000,  // 30 seconds
//             socketTimeoutMS: 30000,   // 30 seconds
//         });
//         console.log('Database connected successfully!');
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//     }
// }

// export default connectToDatabase;
import mongoose from "mongoose";

// Function to connect to the database
export async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      throw new Error("Database connection failed");
    }
  }
}