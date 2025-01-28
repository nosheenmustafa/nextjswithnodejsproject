'use client'

import { useRouter } from 'next/navigation';
interface deleteprops{
  id:string;
}
  export default  function Delete({id}:deleteprops){
    const router = useRouter();
const handleDeletebtn =async()=>{
   const response = await fetch("/api/productsapi",{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json', // Specify JSON content type
    },

    body: JSON.stringify({id}),
   })
   if(response.ok){
     router.refresh();
   }
}
  return(
    <>
   
      <button className="hover:border-2 border-yellow-400 bg-red-400 px-4 py-1 rounded-md text-white font-bold" onClick={handleDeletebtn}>Delete </button>
    </>
  );
 
}