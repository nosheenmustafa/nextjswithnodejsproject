'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import {jwtDecode} from 'jwt-decode';
import Image from 'next/image';

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  profileimage?: string;
}

interface Comment {
  userId: string;
  username: string;
  email: string;
  profile?: string;
  comment: string;
  createdAt: string | null;
}

interface CommentSectionProps {
  cid: string;
  comments: Comment[];
}

export default function CommentSection({ cid, comments }: CommentSectionProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments || []);
  const [commentText, setCommentText] = useState<string>('');
  const [user, setUser] = useState<DecodedToken | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.email || 'session-user',
        email: session.user.email || '',
        name: session.user.name || '',
        profileimage: session.user.image || '/default-profile.png', // Ensure this is passed
      });
      
    } else {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setUser({
            id: decodedToken.id,
            email: decodedToken.email,
            name: decodedToken.name,
          });
        } catch (err) {
          console.error('Invalid token', err);
        }
      }
    }
  }, [session]);

  if (!user) {
    return <p>Please log in to view and add comments.</p>;
  }

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setCommentText(e.target.value);

  const submitComment = async () => {
    const token = localStorage.getItem('authToken');
    if (!user || (!session && !token)) {
      alert('You must be logged in to comment!');
      return;
    }

    if (!commentText.trim()) {
      alert('Comment text cannot be empty!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', cid); // Product ID
      formData.append('commentText', commentText); // Comment text
      formData.append('user', JSON.stringify(user)); // User details

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await fetch('/api/productsapi/comments', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const result = await response.json();
      setLocalComments(result.comments || []);
      setCommentText('');
      alert('Comment added successfully!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <div>
      <textarea
        className="border-2 border-gray-200 row-3 w-full"
        onChange={handleCommentChange}
        value={commentText}
      />
      <button
        className="bg-green-600 text-white font-bold px-2 py-1"
        onClick={submitComment}
      >
        Submit
      </button>
      <div>
        <h3>All Comments</h3>
        <ul>
          {localComments.length > 0 ? (
            localComments.map((comment, index) => (
              <li key={index} className="border p-4 mb-2">
  <p className="font-bold">
  <Image
  src={comment.profile || '/default-profile.png'}
  alt="profile"
  layout="fixed"
  width={50} // Match Tailwind's w-12 (48px)
  height={100} // Match Tailwind's h-24 (96px)
  className="rounded-full object-cover mb-2"
/>

    {comment.username}
    
  </p>
  <p>{comment.comment}</p>
  <p className="float-right">{comment.createdAt}</p>
</li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
