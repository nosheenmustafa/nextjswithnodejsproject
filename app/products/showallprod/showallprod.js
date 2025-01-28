'use client';

import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Delete from '../delete/delete';
import {signOut} from 'next-auth/react';
import { CiSearch } from "react-icons/ci";

export default function ShowAll({ Products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProd, setFilteredProd] = useState(Products);  // Initially show all products
  const[selectedProducts, setSelectedProducts] = useState([]);
//   const router = useRouter();

  useEffect(() => {
    // Filter products when searchTerm changes
    setFilteredProd(
      Products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, Products]);
//handle to select and deselect multiple items
const handleCheckboxChange = (productId) => {
  setSelectedProducts((prev) =>
    prev.includes(productId)
      ? prev.filter((id) => id !== productId) // Remove if already selected
      : [...prev, productId] // Add if not selected
  );
};

//handle  of deletemultiple 
const  handleDeleteSelected =async()=>{
  const response = await fetch('/api/deletemultiple', {
    method: 'DELETE',
    body: JSON.stringify({ ids: selectedProducts }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok){
    console.log("multiple item deleted successfully");
  }
   
}
  return (
    <div>
      <div className="mx-12">
        <button
                className="hover:font-extrabold border-2 border-yellow-400 mt-4 py-2 px-4 rounded bg-red-500 text-white float-right"
                onClick={() => signOut({callbackUrl:'/login'})}
              >
                Log out
              </button>
        <h1 className="text-center font-extrabold mt-2 text-4xl">All Products</h1>

        <div className="flex gap-2 rounded-md p-2 border-2 border-gray-200 mx-auto w-[60%] my-4">
        <CiSearch  className="my-auto font-bold text-lg"/>
        <input
        
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        placeholder="Search products..."
        className="focus:outline-none"
        
      />
        </div>
  <div className="overflow-x-auto">
        <table className="border-collapse  w-full border-2 border-gray-200 rounded-lg table-fixed">
         <thead className="text-left  p-4 ">
            <tr className="font-bold text-xl bg-blue-600   text-white">
            <th className="w-1/6 p-2">select</th>
            <th className="w-1/6 p-2">Title</th>
            <th className="w-1/6 p-2">Price</th>
            <th className="w-1/6 p-2">Image</th>
            <th className="w-1/6 p-2">Added Date</th>
            <th className="w-1/6 p-2 text-center">Action</th>
            </tr>
         </thead>
          <tbody >
            {filteredProd.length > 0 ? (
              filteredProd.map((product) => (
                <tr key={product._id}>
                  <td  className="mt-6">
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleCheckboxChange(product._id)}
                        />
                      }
                      label="" // Empty label for cleaner UI
                    />
                  </td>
                  <td>{product.title}</td>
                  <td className="font-bold text-lg">{product.price}</td>
                  <td>
  <Link href={`/products/singlepage/${product._id}`}>
    <Image
      src={`/uploads/${product.image}`}
      height={128}
      width={128}
      className="hover:border-2 border-yellow-400 w-32 h-32 object-cover rounded-full"
      alt={product.title}
    />
  </Link>
</td>


                  <td>{new Date(product.addedAt).toLocaleDateString()}</td>
                  
                  <td className="px-4 my-8 flex justify-between">
  <Link href={`/products/edit/${product._id}`} className="hover:border-2 border-yellow-400 bg-blue-600 rounded-md px-4 py-2 text-white font-bold ">
    Edit
  </Link>
  <Delete id={product._id}/>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <button
          className="hover:border-2 border-yellow-400 bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleDeleteSelected}
        >
          OK (Delete Selected)
        </button>
        <Link href="/products/add" className="hover:border-2 border-yellow-400 font-bold mt-3 float-right bg-blue-600 rounded-md px-4 py-2 text-white font-bold">Add new Product</Link>
      </div>
    </div>
  );
}
