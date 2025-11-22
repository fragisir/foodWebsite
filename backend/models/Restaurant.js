import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide image URL'],
    },
    cuisineType: {
      type: [String],
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
      default: '30-40 mins',
    },
    deliveryFee: {
      type: Number,
      default: 2.99,
    },
    minOrder: {
      type: Number,
      default: 10,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
