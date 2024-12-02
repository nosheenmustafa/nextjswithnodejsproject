'use client';
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import TextField from '@mui/material/TextField';
import Link from 'next/link'
import {useState} from 'react';
export default function Login(){
 
  const[loginMail, setLoginmail] = useState('');
  const[loginPW, setLoginpw] = useState('');

  const handleLoginmail = (e) => {
    setLoginmail(e.target.value);
  }
  const handleLoginpw = (e) => {
    setLoginpw(e.target.value);
  }

  const handleLogin =async() =>{
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({loginMail,loginPW }),
      });
         const data = await response.json();
         console.log(response.status);
         console.log(response.data);
         }

         catch(error){
          console.log("there is an error of login detail");
         }
  }
    return(
      <div className="p-5 m-5 w-[50%]">
        <h1 className="font-extrabold text-lg">Log in</h1>
        <p className="my-1">Discover a better way of spending with finaco</p>
        <button type="button" className="mt-2 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "><FcGoogle className="my-auto" />Login in with Google</button>
        <button type="button" className="mt-4 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "><BsGithub className="my-auto" />Login in with Github</button>
        <button type="button" className="mt-4 flex  w-full  justify-center py-2 rounded-md bg-gray-100 gap-2 "><FaFacebook className="my-auto" />Login in with facebook</button>
       <p className="flex items-center text-gray-400">
       <span className="flex-grow border-t  border-gray-200"></span>
       <span className="mx-2">or</span>
       <span className="flex-grow border-t  border-gray-200"></span>
       </p>
       <div type="button" className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"><MdEmail/><TextField type="email" className="placeholder:text-black w-full bg-transparent " placeholder="Enter your e-mail" sx={{'& .MuiOutlinedInput-notchedOutline':{border: 'none'},
      }} label="email" value={loginMail} onChange={handleLoginmail}/></div>
       <div type="button" className=" mt-2 w-full items-center flex bg-gray-100 rounded-md px-3 gap-2"><RiLockPasswordFill /><TextField  label ="password" type="password" className="placeholder:text-black w-full bg-transparent " placeholder="password" sx={{'& .MuiOutlinedInput-notchedOutline':{border: 'none'},
      }} value={loginPW} onChange={handleLoginpw}/></div>
       <div className="flex justify-between my-2"><label><TextField   type="checkbox"  className="mr-2 font-bold " sx={{
        '& .MuiOutlinedInput-notchedOutline':{border:'none'},
        '& .MuiInputBase-input': { padding: 0 },
       }}/>Remember me </label>
          <Link  href="/forgetpassword" className="font-bold hover:underline">Forget Password?</Link>
       </div>
       <button className="text-white  px-auto py-2 my-2 w-full text-center bg-green-400 rounded-md" onClick={handleLogin}>Login</button>
       <p>Not a member yet?<Link href="/signup" className="font-bold underline">Create an Account</Link></p>
      </div>
    );
}