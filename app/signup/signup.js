"use client";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react"; // Import signIn and signOut methods


export default function Signup() {
  const [username, setUSerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setConpassword] = useState("");
  const handleUSername = (e) => {
    setUSerName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfpassword = (e) =>{
    setConpassword(e.target.value);
  }
        
  const handleSignuptbtn = async () => {
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, cpassword }),
      });
  
      const textResponse = await response.text(); // Read the raw response
      console.log("Raw response:", textResponse);
  
      if (!response.ok) {
        console.log("Error response status:", response.status);
        console.log("Error response body:", textResponse);
        alert("Signup failed");
        return;
      }
  
      const data = JSON.parse(textResponse); // Parse JSON manually
      console.log("Signup successful:", data);
      alert("Signup is done without any error");
    } catch (error) {
      console.error("Error in signup:", error);
      alert(`Signup error: ${error.message}`);
    }
  };
  
  
  return (
    <div className="p-5 m-5 w-[50%]">
      <h1 className="font-extrabold text-lg">Sign Up</h1>
      <p className="my-1">Discover a better way of spending with finaco</p>
      <button
        type="button"
        className="mt-2 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "
      >
        <FcGoogle className="my-auto" />
        Login in with Google
      </button>
      <button
        type="button"
        className="mt-4 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "
        onClick={() => signIn("github")} 
      >
        <BsGithub className="my-auto" />
        Login in with Github
      </button>
      <button
        type="button"
        className="mt-4 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "
      >
        <FaFacebook className="my-auto" />
        Login in with facebook
      </button>
      <p className="flex items-center text-gray-400">
        <span className="flex-grow border-t  border-gray-200"></span>
        <span className="mx-2">or</span>
        <span className="flex-grow border-t  border-gray-200"></span>
      </p>
      <div
        type="button"
        className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"
      >
        <FaUser />
        <TextField
          type="text"
          label="username"
          className="placeholder:text-black w-full bg-transparent "
          placeholder="Type your name"
          value={username}
          onChange={handleUSername}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        />
      </div>
      <div
        type="button"
        className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"
      >
        <MdEmail />
        <TextField
          type="email"
          label="email"
          className="placeholder:text-black w-full bg-transparent "
          placeholder="Enter your e-mail"
          value={email}
          onChange={handleEmail}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        />
      </div>
      <div
        type="button"
        className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"
      >
        <RiLockPasswordFill />
        <TextField
          type="password"
          label="password"
          className="placeholder:text-black w-full bg-transparent"
          placeholder="password"
          value={password}
          onChange={handlePassword}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        />
      </div>
      <div
        type="button"
        className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"
      >
        <RiLockPasswordFill />
        <TextField
          type="confirm-password"
          label="confirm-password"
          className="placeholder:text-black w-full bg-transparent"
          placeholder="password"
          value={cpassword}
          onChange={handleConfpassword}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        />
      </div>
      <div className="flex justify-between my-2">
        <label>
          <TextField
         
            type="checkbox"
            className="mr-2 font-bold "
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiInputBase-input": { padding: 0 },
            }}
          />
          I agree with Terms and Privacy
        </label>
      </div>
      <button
        className="text-white  px-auto py-2 my-2 w-full text-center bg-green-400 rounded-md"
        onClick={handleSignuptbtn}
      >
        Sign up
      </button>
      <p>
        Not a member yet?
        <Link href="/" className="font-bold underline">
          Create an Account
        </Link>
      </p>
    </div>
  );
}

