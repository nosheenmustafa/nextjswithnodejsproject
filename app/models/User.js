import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
});

// Export the User model
export default mongoose.models.User || mongoose.model("User", userSchema);
