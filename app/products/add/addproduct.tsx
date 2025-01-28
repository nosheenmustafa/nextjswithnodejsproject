'use client';
import { TextField, FormLabel, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

export default function AddProduct() {
  const [title, setTitle] = useState<string>('');
  const [des, setTdes] = useState<string>('');
  const [probrief, setproBrief] = useState<string>('');
  const [price, setprice] = useState<string>('');
  const [Discountprice, setDiscountprice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null); // State for the image file
  const [preview, setPreview] = useState<string | null>(null); // State for the image preview
 
const router = useRouter();
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTdes(e.target.value);
  };

  const handleprobrief = (e: React.ChangeEvent<HTMLInputElement>) => {
    setproBrief(e.target.value);
  };

  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setprice(e.target.value);
  };

  const handledisprice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountprice(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file); // Update image state with the selected file
      setPreview(URL.createObjectURL(file)); // Generate preview URL for the selected image
    }
  };

  const handleAddProductBtn = async () => {
    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "data",
      JSON.stringify({
        title,
        des,
        probrief,
        price,
        Discountprice,
      })
    );
    const response = await fetch("/api/productsapi", {
      method: "POST",
      body: formData, // Don't manually set headers for FormData
    });
  
    if(response.ok){
      router.push('/products');
    }
  };
  
  
  return (
    <main>
      <div className="w-[45%] m-auto mt-8 border-2 border-gray-400 p-8 rounded-md">
        <h3 className="font-bold text-2xl">Add New Product</h3>
        <div>
          <FormLabel className="mb-[-5px]">Product Title</FormLabel>
          <TextField
            type="text"
            label="Add Product Title"
            fullWidth
            placeholder="Add Product Title"
            value={title}
            onChange={handleTitle}
          />
        </div>
        <div className="mt-4">
          <FormLabel htmlFor="Short Description">Short Description</FormLabel>
          <TextField
            id="Short Description"
            type="text"
            label="Add Description"
            fullWidth
            placeholder="Add Description"
            value={des}
            onChange={handleDes}
          />
        </div>
        <div className="mt-4">
          <FormLabel htmlFor="Product Brief">Product Brief</FormLabel>
          <TextField
            id="Product Brief"
            multiline
            rows={4}
            label="Add Brief"
            fullWidth
            placeholder="Add Brief"
            value={probrief}
            onChange={handleprobrief}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center h-auto ">
            <FormLabel htmlFor="Price" className="align-middle">
              Price
            </FormLabel>
            <TextField id="Price" placeholder="0 USD" value={price} onChange={handlePrice} />
          </div>
          <div className="flex items-center">
            <FormLabel htmlFor="Price">Discount Price</FormLabel>
            <TextField id="Price" placeholder="0 USD" value={Discountprice} onChange={handledisprice} />
          </div>
        </div>
        <div className="mt-2">
          <FormLabel htmlFor="select the image">Select the image:</FormLabel>
          <input type="file" onChange={handleImageChange} />
        </div>
        {preview && (
          <div className="mt-4">
            <Image src={preview} alt="Preview" className="w-48 h-48 object-cover" />
          </div>
        )}
        <Button
          variant="contained"
          component="span"
          className="mt-4 w-full"
          onClick={handleAddProductBtn}
        >
          Add Product
        </Button>
      </div>
    </main>
  );
}
