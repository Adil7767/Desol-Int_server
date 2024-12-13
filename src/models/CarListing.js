import mongoose from 'mongoose';

const carListingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carModel: { type: String, required: true, minLength: 3 },
  price: { type: Number, required: true },
  phone: { type: String, required: true, length: 11 },
  city: { type: String, required: true, enum: ['Lahore', 'Karachi'] },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CarListing', carListingSchema);
