import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/db";
import Product from "../../models/product";
import { ObjectId } from "mongodb"; // Ensure ObjectId is imported

// /delete multiple selected products
export async function DELETE(request) {
  await connectToDatabase(); // Ensure your DB connection works
  try {
    const { ids } = await request.json(); // Get the product IDs from the request body

    // Validate the request payload
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
    }

    // Delete products matching the provided IDs
    const result = await Product.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    return NextResponse.json({
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting products:", error.stack);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
