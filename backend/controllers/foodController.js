import FoodItem from '../models/FoodItem.js';

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
export const getFoodItems = async (req, res, next) => {
  try {
    const { restaurant, category, search, vegetarian, vegan, popular, sort } =
      req.query;

    let query = {};

    // Filter by restaurant
    if (restaurant) {
      query.restaurant = restaurant;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by vegetarian
    if (vegetarian === 'true') {
      query.isVegetarian = true;
    }

    // Filter by vegan
    if (vegan === 'true') {
      query.isVegan = true;
    }

    // Filter by popular
    if (popular === 'true') {
      query.popular = true;
    }

    let foodItems = FoodItem.find(query).populate('restaurant', 'name image');

    // Sort
    if (sort === 'price-low') {
      foodItems = foodItems.sort({ price: 1 });
    } else if (sort === 'price-high') {
      foodItems = foodItems.sort({ price: -1 });
    } else if (sort === 'rating') {
      foodItems = foodItems.sort({ rating: -1 });
    } else {
      foodItems = foodItems.sort({ createdAt: -1 });
    }

    const result = await foodItems;

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
export const getFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate(
      'restaurant',
      'name image deliveryTime deliveryFee'
    );

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.create(req.body);

    res.status(201).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food items by restaurant
// @route   GET /api/restaurants/:restaurantId/foods
// @access  Public
export const getFoodsByRestaurant = async (req, res, next) => {
  try {
    const foodItems = await FoodItem.find({
      restaurant: req.params.restaurantId,
    });

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
};
