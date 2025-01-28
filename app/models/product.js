import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  des: { type: String, required: true },
  probrief: { type: String, required: true },
  price: { type: String },
  Discountprice: { type: String },
  image: { type: String },
  addedAt: { type: Date, default: Date.now }, // Automatically sets the current date and time
  likes: { type: Number, default: 0 }, // Add default value
  dislikes: { type: Number, default: 0 }, // Add default value
  heart: { type: Number, default: 0 },
  // userId:{type:Number,default:0} ,// Add default value
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Corrected ObjectId reference
      username:String,
      email:String,
      profile: {type:String},
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  userActions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Corrected ObjectId reference
      action: { type: String, enum: ['likes', 'dislikes', 'heart'], default: null },
    },
  ],
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
