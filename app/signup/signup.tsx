"use client";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Signup() {
  const [username, setUSerName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setConpassword] = useState<string>("");
  const [showpw, setshowPw] = useState<boolean>(false);
  const [showCpw, setshowCpw] = useState<boolean>(false);
  const [snackbaropen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const router = useRouter();

  const opensnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleUSername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUSerName(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConpassword(e.target.value);
  };

  const togglepasswordVisibility = () => {
    setshowPw((prevState) => !prevState);
  };

  const toggleConfirmpwVis = () => {
    setshowCpw((prevState) => !prevState);
  };

  const handleSignuptbtn = async () => {
    if (password !== cpassword) {
      opensnackbar("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, cpassword }),
      });

      if (!response.ok) {
        opensnackbar("Signup failed! Please try again.", "error");
        return;
      }

      opensnackbar("Signup successful! Redirecting to login...", "success");
      setTimeout(() => router.push("/login"), 2000);
    } catch{
      opensnackbar("Signup error. Please try again.", "error");
    }
  };

  return (
    <div
      className="m-0 bg-cover bg-center h-screen overflow-hidden"
      style={{ backgroundImage: "url('/uploads/signupbg.jpeg')" }}
    >
      <div className="p-5 m-5 w-[40%] mx-auto">
        <p className="font-extrabold text-2xl text-white text-center font-bold mb-4">Sign Up</p>
        <div className="mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2">
          <FaUser />
          <TextField
            type="text"
            label="username"
            className="placeholder:text-black w-full bg-transparent"
            placeholder="Type your name"
            value={username}
            onChange={handleUSername}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          />
        </div>
        <div className="mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2">
          <MdEmail />
          <TextField
            type="email"
            label="email"
            className="placeholder:text-black w-full bg-transparent"
            placeholder="Enter your e-mail"
            value={email}
            onChange={handleEmail}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          />
        </div>
        <div className="mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2">
          <RiLockPasswordFill />
          <TextField
            type={showpw ? "text" : "password"}
            label="password"
            className="placeholder:text-black w-full bg-transparent"
            placeholder="password"
            value={password}
            onChange={handlePassword}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          />
          <div onClick={togglepasswordVisibility}>
            {showpw ? <FaEye /> : <FaRegEyeSlash />}
          </div>
        </div>
        <div className="mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2">
          <RiLockPasswordFill />
          <TextField
            type={showCpw ? "text" : "password"}
            label="confirm-password"
            className="placeholder:text-black w-full bg-transparent"
            placeholder="confirm-password"
            value={cpassword}
            onChange={handleConfpassword}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          />
          <div onClick={toggleConfirmpwVis}>
            {showCpw ? <FaEye /> : <FaRegEyeSlash />}
          </div>
        </div>
        <div className="flex justify-between my-2">
          <label className="text-white">
            <TextField
              type="checkbox"
              className="mr-2 font-bold"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiInputBase-input": { padding: 0 },
              }}
            />
            I agree with Terms and Privacy
          </label>
        </div>
        <button
          className="text-white px-auto py-2 my-2 w-full text-center bg-green-400 rounded-md"
          onClick={handleSignuptbtn}
        >
          Sign up
        </button>
        <p className="text-white">
          Already have an account
          <Link href="/login" className="text-white px-4 underline decoration-solid">
            Login
          </Link>
        </p>
        <Snackbar
          open={snackbaropen}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
