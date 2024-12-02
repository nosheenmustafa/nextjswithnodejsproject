import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";


export async function POST(request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const { username, email, password, cpassword } = await request.json();
    console.log("Received data:", { username, email, password, cpassword });
   
    //check if the password and confirm password are same or not
     
    if (password !== cpassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user document with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      cpassword,
    });

    // Save the new user to the database
    await newUser.save();
    console.log("User created successfully");

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API:", error.message);
    return NextResponse.json(
      { success: false, message: "Error in registering the user" },
      { status: 500 }
    );
  }
}
