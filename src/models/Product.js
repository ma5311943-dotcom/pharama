import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity.'],
    default: 0,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300?text=No+Image'
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock',
  }
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
