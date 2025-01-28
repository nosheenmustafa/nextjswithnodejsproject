import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '../../../models/product';
import { connectToDatabase } from '../../../lib/db';

export async function POST(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    console.error("JWT secret key is not defined");
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }

  try {
    await connectToDatabase();
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    const { id, action } = await request.json();
    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: "Missing product ID or action" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID format");
    }

    const validActions = ['likes', 'dislikes', 'heart'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action provided" },
        { status: 400 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const product = await Product.findById(objectId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the user has already performed an action
    const existingAction = product.userActions.find((entry) => entry.userId.toString() === userId);

    if (existingAction) {
      return NextResponse.json(
        { success: false, message: `You have already ${existingAction.action}d this product` },
        { status: 400 }
      );
    }

    // Increment the appropriate field and add the user action
    // const updateField = action === 'likes' ? { likes: 1 } :
    //                     action === 'dislikes' ? { dislikes: 1 } :
    //                     action === 'heart' ? { heart: 1 } : null;

    product.userActions.push({ userId, action });
    product[action] += 1;

    await product.save();

    return NextResponse.json({
      success: true,
      likes: product.likes,
      dislikes: product.dislikes,
      heart: product.heart,
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
