import { connectToDatabase } from '../../lib/db';
import Product from '../../models/product';
import CommentSection from '../comments/comment';

interface HomeProps {
  params: {
    id: string;
  };
}

interface Comment {
  userId: string;
  username: string;
  email: string;
  profile: string;
  comment: string;
  createdAt: string | null;
}

interface ProductComment {
  userId: string | { toString: () => string }; // Handle both string and ObjectId
  username?: string;
  email?: string;
  profile?: string;
  comment?: string;
  createdAt?: Date | string;
}

export default async function CommentHome({ params }: HomeProps): Promise<JSX.Element> {
  await connectToDatabase();

  const { id } = params;
  let comments: Comment[] = [];

  try {
    const product = await Product.findById(id).select('comments');
    console.log('Raw product data:', product);

    if (product?.comments) {
      comments = product.comments.map((comment: ProductComment): Comment => ({
        userId: typeof comment.userId === 'object' && comment.userId.toString ? comment.userId.toString() : '',
        username: comment.username || 'Anonymous',
        email: comment.email || '',
        profile: comment.profile || '/default-profile.png',
        comment: comment.comment || '',
        createdAt: comment.createdAt
          ? new Date(comment.createdAt).toISOString()
          : null,
      }));
    } else {
      console.error('No comments found for the product with ID:', id);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }

  console.log('Serialized comments:', comments);

  return (
    <div>
      <main>
        <div>
          <CommentSection cid={id} comments={comments} />
        </div>
      </main>
    </div>
  );
}
