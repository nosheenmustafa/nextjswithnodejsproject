import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '../../../models/product';
import { connectToDatabase } from '../../../lib/db';
// import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from "fs/promises";

export async function POST(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    console.error("JWT secret key is not defined");
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }

  try {
    await connectToDatabase();
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const formData = await request.formData();
    const id = formData.get('id');
    const commentText = formData.get('commentText');
    const user = JSON.parse(formData.get('user'));
    const file = formData.get('image'); // Optional file

    if (!commentText || !user) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Default profile image path
    let profilePath = user.profileimage || '/uploads/default-profile.png';

// Process uploaded file
if (file && file.name) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + '-' + file.name.replace(/\s+/g, '_');
  const uploadPath = path.join(process.cwd(), "public/uploads");

  try {
    await mkdir(uploadPath, { recursive: true });
    const filePath = path.join(uploadPath, filename);
    await writeFile(filePath, buffer);

    // Save the relative path for the uploaded file
    profilePath = `/uploads/${filename}`;
  } catch (err) {
    console.error("Error saving file:", err);
    return NextResponse.json({ error: "Error saving file." }, { status: 500 });
  }
}


    // Find the product
    const objectId = new mongoose.Types.ObjectId(id);
    const product = await Product.findById(objectId);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Save the comment with user details
    const comment = {
      userId,
      username: user.name,
      profile: profilePath, // Use the profilePath
      comment: commentText,
      createdAt: new Date().toISOString(), // Add createdAt timestamp
    };
    product.comments.push(comment);
    await product.save();

    return NextResponse.json({ success: true, comments: product.comments }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
