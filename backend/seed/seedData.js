import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Sample restaurants data
const restaurants = [
  {
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas made with fresh ingredients and traditional recipes.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    cuisineType: ['Italian', 'Pizza'],
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    rating: 4.7,
    reviewCount: 234,
    deliveryTime: '25-35 mins',
    deliveryFee: 2.99,
    minOrder: 15,
    featured: true,
  },
  {
    name: 'Burger Barn',
    description: 'Gourmet burgers crafted with premium beef and fresh toppings.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    cuisineType: ['American', 'Burger'],
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
    },
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: '20-30 mins',
    deliveryFee: 1.99,
    minOrder: 12,
    featured: true,
  },
  {
    name: 'Sushi Express',
    description: 'Fresh sushi and Japanese cuisine delivered to your door.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    cuisineType: ['Japanese', 'Sushi', 'Asian'],
    address: {
      street: '789 Pine Rd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    },
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: '30-40 mins',
    deliveryFee: 3.99,
    minOrder: 20,
    featured: true,
  },
  {
    name: 'Taco Fiesta',
    description: 'Authentic Mexican tacos, burritos, and more with a modern twist.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    cuisineType: ['Mexican'],
    address: {
      street: '321 Elm St',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
    },
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '20-30 mins',
    deliveryFee: 2.49,
    minOrder: 10,
    featured: false,
  },
  {
    name: 'Pasta Paradise',
    description: 'Homemade pasta dishes with authentic Italian flavors.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    cuisineType: ['Italian', 'Pasta'],
    address: {
      street: '654 Maple Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    rating: 4.7,
    reviewCount: 201,
    deliveryTime: '25-35 mins',
    deliveryFee: 2.99,
    minOrder: 15,
    featured: false,
  },
  {
    name: 'Curry House',
    description: 'Aromatic Indian curries and traditional dishes bursting with flavor.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    cuisineType: ['Indian', 'Asian'],
    address: {
      street: '987 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
    },
    rating: 4.9,
    reviewCount: 278,
    deliveryTime: '30-40 mins',
    deliveryFee: 3.49,
    minOrder: 18,
    featured: true,
  },
];

// Function to generate food items for each restaurant
const generateFoodItems = (restaurantId, restaurantName, cuisineType) => {
  const foods = [];

  if (cuisineType.includes('Pizza') || cuisineType.includes('Italian')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'Margherita Pizza',
        description: 'Classic tomato sauce, fresh mozzarella, and basil on thin crust.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
        price: 14.99,
        category: 'Pizza',
        isVegetarian: true,
        rating: 4.7,
        reviewCount: 89,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni, mozzarella, and tomato sauce.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600',
        price: 16.99,
        category: 'Pizza',
        rating: 4.8,
        reviewCount: 124,
        popular: true,
      }
    );
  }

  if (cuisineType.includes('Pasta')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with pancetta, eggs, and parmesan cheese.',
        image: 'https://images.unsplash.com/photo-1612874742237-6526dd07d82c?w=600',
        price: 15.99,
        category: 'Pasta',
        rating: 4.6,
        reviewCount: 67,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato sauce with garlic and red chili peppers.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
        price: 13.99,
        category: 'Pasta',
        isVegetarian: true,
        spicyLevel: 3,
        rating: 4.5,
        reviewCount: 54,
      }
    );
  }

  if (cuisineType.includes('Burger')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheddar cheese, lettuce, tomato, and special sauce.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        price: 12.99,
        category: 'Burger',
        rating: 4.6,
        reviewCount: 156,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Veggie Burger',
        description: 'Plant-based patty with avocado, lettuce, and vegan mayo.',
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600',
        price: 11.99,
        category: 'Burger',
        isVegetarian: true,
        isVegan: true,
        rating: 4.4,
        reviewCount: 78,
      }
    );
  }

  if (cuisineType.includes('Sushi') || cuisineType.includes('Japanese')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber wrapped in seaweed and rice.',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
        price: 8.99,
        category: 'Sushi',
        rating: 4.7,
        reviewCount: 203,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over pressed sushi rice.',
        image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600',
        price: 6.99,
        category: 'Sushi',
        rating: 4.9,
        reviewCount: 178,
        popular: true,
      }
    );
  }

  if (cuisineType.includes('Mexican')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'Beef Tacos',
        description: 'Three soft tacos with seasoned beef, lettuce, cheese, and salsa.',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
        price: 9.99,
        category: 'Mexican',
        spicyLevel: 2,
        rating: 4.5,
        reviewCount: 134,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Chicken Burrito',
        description: 'Grilled chicken, rice, beans, cheese, and guacamole wrapped in a tortilla.',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600',
        price: 11.99,
        category: 'Mexican',
        rating: 4.6,
        reviewCount: 98,
      }
    );
  }

  if (cuisineType.includes('Indian')) {
    foods.push(
      {
        restaurant: restaurantId,
        name: 'Chicken Tikka Masala',
        description: 'Tender chicken in a creamy tomato-based curry sauce.',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',
        price: 14.99,
        category: 'Indian',
        spicyLevel: 2,
        rating: 4.8,
        reviewCount: 245,
        popular: true,
      },
      {
        restaurant: restaurantId,
        name: 'Vegetable Biryani',
        description: 'Fragrant basmati rice with mixed vegetables and aromatic spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        price: 12.99,
        category: 'Indian',
        isVegetarian: true,
        spicyLevel: 1,
        rating: 4.7,
        reviewCount: 167,
      }
    );
  }

  // Add some desserts and drinks for variety
  foods.push(
    {
      restaurant: restaurantId,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600',
      price: 6.99,
      category: 'Dessert',
      isVegetarian: true,
      rating: 4.9,
      reviewCount: 112,
    },
    {
      restaurant: restaurantId,
      name: 'Soft Drink',
      description: 'Choice of Coke, Sprite, or Fanta.',
      image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600',
      price: 2.99,
      category: 'Drinks',
      isVegetarian: true,
      isVegan: true,
      rating: 4.3,
      reviewCount: 45,
    }
  );

  return foods;
};

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed...');

    // Create restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('✅ Restaurants Imported...');

    // Create food items for each restaurant
    let allFoodItems = [];
    createdRestaurants.forEach((restaurant) => {
      const foodItems = generateFoodItems(
        restaurant._id,
        restaurant.name,
        restaurant.cuisineType
      );
      allFoodItems = [...allFoodItems, ...foodItems];
    });

    await FoodItem.insertMany(allFoodItems);
    console.log('✅ Food Items Imported...');

    // Create a sample admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@foodies.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create a sample regular user
    await User.create({
      name: 'roshan',
      email: 'roshan@gmail.com',
      password: 'password123',
      phone: '555-0123',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
    });

    console.log('✅ Users Imported...');
    console.log('');
    console.log('🎉 All data imported successfully!');
    console.log('');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@foodies.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📧 User credentials:');
    console.log('   Email: roshan@gmail.com');
    console.log('   Password: password123');
    console.log('');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Connect to DB
connectDB();

// Check command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
