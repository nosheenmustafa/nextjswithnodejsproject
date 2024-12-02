import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';

export async function POST(request) {
  const { loginMail, loginPW } = await request.json();

  try {
    // Connect to the database
    await connectToDatabase();

    console.log("Router is working for login");
    console.log("Received data:", { loginMail, loginPW });

    // Find the user by email
    const loginUseremail = await User.findOne({ email: loginMail });

    if (!loginUseremail) {
      // Email not found
      return NextResponse.json(
        { success: false, message: "Email does not match" },
        { status: 404 } // Not Found
      );
    }

    // Check if the password matches below line compare the password of that user which email is already compared
    const isPasswordValid = await bcrypt.compare(loginPW, loginUseremail.password);
    if (!isPasswordValid) {
      // Invalid password
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 } // Unauthorized
      );
    }

    // If both email and password are valid
    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API:", error.message);
    return NextResponse.json(
      { success: false, message: "Error in processing the request" },
      { status: 500 } // Internal Server Error
      
    );
  }
}
