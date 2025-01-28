import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/db";
import Product from "../../models/product";
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // Required for handling multipart/form-data
  },
};

export async function POST(request) {
  await connectToDatabase();

  try {
    const formData = await request.formData();

    const dataString = formData.get("data");
    const data = JSON.parse(dataString);

    const title = data.title;
    const des = data.des;
    const probrief = data.probrief;
    const price = data.price;
    const Discountprice = data.Discountprice;
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No image received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    const uploadPath = path.join(process.cwd(), "public/uploads");

    try {
      await mkdir(uploadPath, { recursive: true });
    } catch (err) {
      console.error("Error creating upload directory:", err);
      return NextResponse.json({ error: "Failed to create upload directory.", details: err.message }, { status: 500 });
    }

    try {
      const filePath = path.join(uploadPath, filename);
      await writeFile(filePath, buffer);
    } catch (err) {
      console.error("Error saving file:", err);
      return NextResponse.json({ error: "Error saving file.", details: err.message }, { status: 500 });
    }

    if (!title || !des || !probrief || !price || !Discountprice || !filename) {
      throw new Error("Missing required fields");
    }

    const newProduct = new Product({
      title,
      des,
      probrief,
      price,
      Discountprice,
      image: filename,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      { success: true, message: "Product saved successfully", data: savedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during POST request:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 400 }
    );
  }
}

// PUT route
export async function PUT(request) {
  try {
    const formData = await request.formData();

    const dataparse = formData.get("data");
    const data = JSON.parse(dataparse);
    const id = data.id;
    const title = data.title;
    const des = data.des;
    const probrief = data.probrief;
    const price = data.price;
    const Discountprice = data.Discountprice;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (des) updateFields.des = des;
    if (probrief) updateFields.probrief = probrief;
    if (price) updateFields.price = price;
    if (Discountprice) updateFields.Discountprice = Discountprice;

    const productImage = formData.get('file');
    if (productImage && productImage instanceof Blob) {
      const buffer = Buffer.from(await productImage.arrayBuffer());
      const filename = Date.now() + productImage.name.replaceAll(" ", "_");
      const uploadPath = path.join(process.cwd(), "public/uploads");

      const filePath = path.join(uploadPath, filename);

      try {
        await fs.promises.mkdir(uploadPath, { recursive: true });
      } catch (err) {
        console.error("Failed to create upload directory:", err);
        return NextResponse.json({ error: "Failed to create upload directory.", details: err.message }, { status: 500 });
      }

      try {
        await fs.promises.writeFile(filePath, buffer);
        updateFields.image = filename;
      } catch (err) {
        console.error('Error saving file:', err);
        return NextResponse.json({ error: "Error saving file.", details: err.message }, { status: 500 });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });

  } catch (error) {
    console.error("Error during PUT request:", error);
    return NextResponse.json({ success: false, error: error.message || "Error saving product" }, { status: 500 });
  }
}

// DELETE route
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleteProduct = await Product.findByIdAndDelete(id);
    if (deleteProduct) {
      return NextResponse.json({ message: "Product deleted successfully", id });
    } else {
      throw new Error("Product not found");
    }

  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// GET route
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required to fetch the data of the product" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
