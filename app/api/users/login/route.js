import dotenv from 'dotenv';
dotenv.config();
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import jwt
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY is not defined in the environment variables");
  }

  try {
    const { loginMail, loginPW } = await request.json();

    await connectToDatabase();
    console.log("Router is working for login");

    // Find the user by email
    const user = await User.findOne({ email: loginMail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email does not match" },
        { status: 404 }
      );
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(loginPW, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.username }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "5h" } // Token expiration
    );
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      // You can also add profile image or other details if available
      profileImage: user.profileImage || '',
    };

// Send both the token and user data back to the client
return NextResponse.json(
  {
    success: true,
    message: "Login successful",
    token,
    userData, // Send user data along with the token
  },
  { status: 200 }
);
    // // Send the token back to the client
    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Login successful",
    //     token,
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("Error in API:", error.stack || error);
    return NextResponse.json(
      { success: false, message: "Error in processing the request" },
      { status: 500 }
    );
  }
}
