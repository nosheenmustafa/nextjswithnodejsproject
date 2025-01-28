import type { NextConfig } from "next";

const nextConfig: NextConfig = 
  module.exports = {
    env: {
      JWT_SECRET: process.env.JWT_SECRET,
    },
  
    images: {
      domains: ['lh3.googleusercontent.com','avatars.githubusercontent.com'],
      
    },
    
};

export default nextConfig;
