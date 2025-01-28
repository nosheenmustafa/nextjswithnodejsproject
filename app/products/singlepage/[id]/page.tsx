import { connectToDatabase } from "../../../lib/db";
import Product from "../../../models/product";
import Singlepage from "./singlepage";

interface HomeProps {
  params: {
    id: string;
  };
}
interface comment{
  userId:string;
  username:string;
  email:string;
  profile?:string;
  comment:string;
  createdAt:string;
}
interface actions{
  userId:string;
  action:string;
}
interface ProductType {
  _id: string;
  title: string;
  des: string;
  probrief: string;
  price?: string;
  Discountprice?: string;
  image?: string;
  addedAt: string | null;
  comments:comment[];
  userActions:actions[];
  likes: number;
  dislikes: number;
  heart: number;
}

export default async function Home({ params }: HomeProps) {
  await connectToDatabase();

  let product: ProductType | null = null; // Use proper typing for `product`
  const { id } = params;

  try {
    // Fetch the product and convert it to a plain object
    const result = await Product.findById(id);
    console.log("result of single product", result);

    if (result) {
      product = {
        _id: result._id.toString(), // Convert ObjectId to string
        title: result.title,
        des: result.des,
        probrief: result.probrief,
        price: result.price || null,
        Discountprice: result.Discountprice || null,
        image: result.image || null,
        addedAt: result.addedAt ? result.addedAt.toISOString() : null,
        comments: result.comments.map((comment: comment) => ({
          userId: comment.userId.toString(),
          username: comment.username,
          email: comment.email,
          profile: comment.profile || null,
          comment: comment.comment,
          createdAt: comment.createdAt ? comment.createdAt.toString() : null,
        })),
        userActions: result.userActions.map((action: actions) => ({
          userId: action.userId.toString(),
          action: action.action,
        })),
        likes: result.likes || 0,
        dislikes: result.dislikes || 0,
        heart: result.heart || 0,
      };
    } else {
      console.error("Product not found for ID:", id);
    }
  } catch (error) {
    console.error("Error fetching the product:", error);
  }

  return (
    <div>
      <main>
        <div>
          {/* Pass the id and product props to Singlepage */}
          <Singlepage id={id} result={product} />
        </div>
      </main>
    </div>
  );
}
