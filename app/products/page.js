import { connectToDatabase } from "../lib/db";
import Product from "../models/product";
import ShowAll from './showallprod/showallprod';

export default async function ProductPage() {
  await connectToDatabase();

  let products = [];

  try {
    // Fetch products with lean() to return plain JavaScript objects
    products = await Product.find().lean();

    // Serialize the products for Client Components
    products = products.map(product => ({
      ...product,
      _id: product._id.toString(), // Convert ObjectId to string
      addedAt: product.addedAt ? product.addedAt.toISOString() : null, // Convert Date to ISO string
      userId: product.userId?.toString() || null, // Convert nested ObjectId to string if it exists

      // Serialize nested `comments` array
      comments: product.comments?.map(comment => ({
        ...comment,
        _id: comment._id.toString(), // Convert ObjectId to string
        userId: comment.userId.toString(), // Convert ObjectId to string
        createdAt: comment.createdAt ? comment.createdAt.toISOString() : null, // Convert Date to ISO string
      })) || [],

      // Serialize nested `userActions` array
      userActions: product.userActions?.map(action => ({
        ...action,
        _id: action._id.toString(), // Convert ObjectId to string
        userId: action.userId.toString(), // Convert ObjectId to string
      })) || [],
    }));

    console.log("Serialized Products:", products);
  } catch (error) {
    console.error("Error fetching the products:", error);
  }

  return (
    <div>
      <main>
        <div>
          <ShowAll Products={products} />
        </div>
      </main>
    </div>
  );
}
