import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide food item name'],
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
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Pizza',
        'Burger',
        'Sushi',
        'Pasta',
        'Salad',
        'Dessert',
        'Drinks',
        'Appetizers',
        'Main Course',
        'Asian',
        'Mexican',
        'Indian',
        'Italian',
        'American',
        'Vegetarian',
        'Vegan',
        'Other',
      ],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    calories: {
      type: Number,
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
    available: {
      type: Boolean,
      default: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
