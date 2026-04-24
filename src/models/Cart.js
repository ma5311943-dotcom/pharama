import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [
    {
      id: String, // Product ID
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
