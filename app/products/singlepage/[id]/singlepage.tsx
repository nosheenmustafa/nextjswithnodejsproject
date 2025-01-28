// SinglePage Component
'use client';
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";

// import { Token } from '@mui/icons-material';
import Image from 'next/image';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import CommentSection from '../../comments/comment';
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
  likes: number;
  dislikes: number;
  heart: number;
}
interface comment{
  userId:string;
  username:string;
  email:string;
  profile?:string;
  comment:string;
  createdAt:string;
}
// interface actions{
//   userId:string;
//   action:string;
// }

interface ChildProps {
  id: string;
  result: ProductType | null;
}

export default function SinglePage({ id, result }: ChildProps) {
  const [likeCount, setLikeCount] = useState(result?.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(result?.dislikes || 0);
  const [heartCount, setHeartCount] = useState(result?.heart || 0);
  const { data: session } = useSession();
  
  const isLoggedIn = session || localStorage.getItem("authToken");

  if (!result) {
    return <h1>Product not found</h1>;
  }

 

  const handleReaction = async (action: string) => {
    try {
      const token = session?.accessToken;
      if (!token) {
        alert("No token found! Please log in again.");
        return;
      }
  
      const response = await fetch("/api/productsapi/like-dislike-heartapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action }),
      });
  
      const data = await response.json();
      setLikeCount(data.likes || likeCount);
      setDislikeCount(data.dislikes || dislikeCount);
      setHeartCount(data.heart || heartCount);
    } catch (error) {
      console.error("Error during reaction send:", error);
    }
  };
  

  return isLoggedIn ? (
    <>
      <div>
        {session && (
          <div>
            <p>Welcome, {session.user?.name}</p>
            <p>Email: {session.user?.email}</p>
          
            <Image
              src={session.user?.image || "/default-profile.png"}
              alt="Profile"
              width={48}
              height={48}
             
            />
          </div>
        )}
      </div>
      <h1 className="text-center mt-6">Single Page</h1>
      <div className="w-[50%] border-2 border-gray-200 mx-auto p-4 rounded-md">
        <h1 className="font-bold text-center text-2xl">{result.title}</h1>
        <p>{result.des}</p>
        <p>{result.probrief}</p>
        <p>Price: {result.price || "N/A"}</p>
        <p>Discount Price: {result.Discountprice || "N/A"}</p>
        <Image
          src={result.image ? `/uploads/${result.image}` : "/placeholder.png"}
          width={128}
          height={128}
          alt={result.title}
          className="w-full"
        />
        <div className="flex justify-between">
          <button
            className="bg-green-600 text-white p-2 font-bold rounded-md"
            onClick={() => handleReaction("likes")}
          >
            <AiOutlineLike className="font-bold text-2xl" /> {likeCount}
          </button>
          <button
            className="bg-red-600 rounded-md text-white p-2 font-bold"
            onClick={() => handleReaction("dislikes")}
          >
            <BiDislike className="font-bold text-2xl" />{" "}
            {dislikeCount > 0 ? `${dislikeCount}` : ""}
          </button>
        </div>
        <button className="text-red-500" onClick={() => handleReaction("heart")}>
          <FaHeart />
          {heartCount > 0 ? `${heartCount}` : ""}
        </button>
        <CommentSection cid={id}  comments={result.comments || []} />
      </div>
    </>
  ) : (
    <p>No user found</p>
  );
}
