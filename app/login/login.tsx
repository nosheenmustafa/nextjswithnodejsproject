'use client';

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import {  FaEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Login() {
  const { data: session } = useSession();
  const [loginMail, setLoginMail] = useState<string>('');
  const [loginPW, setLoginPW] = useState<string>('');
  const [showPw, setShowPw] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/products'); // Redirect to products page if logged in
    }
  }, [session, router]);

  const handleLoginMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginMail(e.target.value);
  };

  const handleLoginPW = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPW(e.target.value);
  };

  const togglePWVisibility = () => {
    setShowPw((prevState) => !prevState);
  };

  const handleManualLogin = async () => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginMail, loginPW }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
  
        // Manually store user data in session (example)
        sessionStorage.setItem("userData", JSON.stringify(data.userData));
  
        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
  
        router.push('/products');
      } else {
        setSnackbarMessage(data.message || "Login failed!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbarMessage("An error occurred during login!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="m-0 bg-cover bg-center h-screen overflow-hidden" style={{ backgroundImage: "url('/uploads/loginimg.jpg')" }}>
      <div className="p-5 m-5 w-[40%] mx-auto">
        <h1 className="font-extrabold text-2xl font-bold text-center mb-4">Log in</h1>
        <p className="my-1">Discover a better way of spending with Finaco</p>

        <button
          type="button"
          className="mt-2 flex w-full justify-center py-2 rounded-md bg-gray-100 gap-2"
          onClick={() => signIn("google", { callbackUrl: "/products" })}
        >
          <FcGoogle className="my-auto" />
          Login with Google
        </button>

        <button
          type="button"
          className="mt-4 flex w-full justify-center py-2 rounded-md bg-gray-100 gap-2"
          onClick={() => signIn("github", { callbackUrl: "/products" })}
        >
          <BsGithub className="my-auto" />
          Login with GitHub
        </button>

        <p className="flex items-center text-gray-400 my-2">
          <span className="flex-grow border-t border-gray-200"></span>
          <span className="mx-2">or</span>
          <span className="flex-grow border-t border-gray-200"></span>
        </p>

        <div className="mt-2 w-full flex items-center bg-gray-100 rounded-md px-3 gap-2">
          <MdEmail />
          <TextField
            type="email"
            className="placeholder:text-black w-full bg-transparent"
            placeholder="Enter your e-mail"
            sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            label="Email"
            value={loginMail}
            onChange={handleLoginMail}
          />
        </div>

        <div className="mt-2 w-full flex items-center bg-gray-100 rounded-md px-3 gap-2">
          <RiLockPasswordFill />
          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            className="placeholder:text-black w-full bg-transparent"
            placeholder="Password"
            sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            value={loginPW}
            onChange={handleLoginPW}
          />
          <div onClick={togglePWVisibility}>
            {showPw ? <FaEye /> : <FaRegEyeSlash />}
          </div>
        </div>

        <div className="flex justify-between my-2">
          <label>
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <Link href="/forgetpassword" className="font-bold hover:underline">
            Forget Password?
          </Link>
        </div>

        <button
          className="text-white px-auto py-2 my-2 w-full text-center bg-green-400 rounded-md"
          onClick={handleManualLogin}
        >
          Login
        </button>

        <p>
          Not a member yet?{" "}
          <Link href="/signup" className="font-bold underline">
            Create an Account
          </Link>
        </p>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
