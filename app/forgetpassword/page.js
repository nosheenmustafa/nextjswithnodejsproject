import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Button from  '@mui/material/Button';
import { MdEmail } from "react-icons/md";

export default function Forgetpw(){
  return(
    <div>
      <h1 className="text-center mt-[9%]">Logo here</h1>
      <div className="px-4 py-6 mx-auto  w-2/5 border-2 border-gray-200">
         <h1 className="text-center font-extrabold  text-2xl">Forget your password?</h1>
         <p className="text-center">Enter the emial address you signed up with and wait for your recovery details to be sent</p>
         <div className="px-3 py-2 rounded-md mt-2 gap-3 items-center flex border-2 border-gray-100 bg-gray-100"><MdEmail className=""/><TextField  type="email" placeholder="Enter your e-mail" sx={{'& .MuiOutlinedInput-notchedOutline':{border:'none'},
          '& .MuiInputBase-input': { padding: 0 },}}/></div>
          <Button variant="contained"  className="mt-4 w-full bg-green-600">Submit</Button>
          <p className="mt-2">Did not get the code <Link href="/resendcode" className="underline font-bold">Resend</Link></p>

    </div>
    </div>
  );
}