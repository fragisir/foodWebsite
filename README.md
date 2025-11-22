# 🍔 Foodies - Full-Stack Food Delivery Application

A modern, full-featured food delivery web application built with **Next.js** (frontend) and **Express + MongoDB** (backend).

![Foodies Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop)

## ✨ Features

### 🎨 Frontend (Next.js)
- **Authentication System**: Login/Signup with JWT stored in HttpOnly cookies
- **Premium UI/UX**: Modern design with Tailwind CSS and Framer Motion animations
- **Landing Page**: Hero section, popular categories, featured restaurants
- **Restaurant Pages**: Browse all restaurants, view details, and menu items
- **Shopping Cart**: Add items, adjust quantities, view summary
- **Checkout**: Complete order with delivery address and payment method
- **Order History**: Track all orders with status updates
- **User Profile**: View and edit personal information
- **Protected Routes**: Secure pages requiring authentication
- **State Management**: Zustand for global state (authentication and cart)
- **Toast Notifications**: User feedback for actions

### 🚀 Backend (Express + MongoDB)
- **RESTful API**: Clean and organized endpoints
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database Models**: User, Restaurant, FoodItem, Order
- **CRUD Operations**: Full Create, Read, Update, Delete for all resources
- **Middleware**: Auth middleware, error handling
- **Data Seeding**: Sample data for testing
- **CORS**: Configured for frontend requests

## 📁 Project Structure

```
food/
├── backend/                  # Express.js Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── foodController.js
│   │   └── orderController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── FoodItem.js
│   │   └── Order.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── foodRoutes.js
│   │   └── orderRoutes.js
│   ├── seed/                # Database seeding
│   │   └── seedData.js
│   ├── utils/               # Utility functions
│   │   └── generateToken.js
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Entry point
│
└── frontend/                # Next.js Frontend
    ├── app/                 # Next.js App Router
    │   ├── restaurants/
    │   │   ├── page.tsx     # Restaurants list
    │   │   └── [id]/page.tsx # Restaurant details
    │   ├── cart/page.tsx
    │   ├── checkout/page.tsx
    │   ├── orders/page.tsx
    │   ├── profile/page.tsx
    │   ├── layout.tsx
    │   └── page.tsx         # Landing page
    ├── components/
    │   ├── ui/              # Reusable UI components
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── LoginModal.tsx
    │   └── features/        # Feature components
    │       ├── Hero.tsx
    │       ├── RestaurantCard.tsx
    │       ├── FoodCard.tsx
    │       ├── CategoryCard.tsx
    │       ├── ProtectedRoute.tsx
    │       ├── PopularCategories.tsx
    │       └── FeaturedRestaurants.tsx
    ├── lib/
    │   └── api.ts           # Axios client
    ├── store/               # Zustand stores
    │   ├── authStore.ts
    │   └── cartStore.ts
    ├── types/
    │   └── index.ts         # TypeScript types
    ├── utils/
    │   └── helpers.ts       # Utility functions
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, Cookie Parser

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env` file):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodies
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   
   This will create:
   - Sample restaurants with food items
   - Admin user: `admin@foodies.com` / `admin123`
   - Regular user: `john@example.com` / `password123`

6. **Start the server**:
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env.local` file):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   App will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)
- `PUT /updateprofile` - Update user profile (protected)

### Restaurants (`/api/restaurants`)
- `GET /` - Get all restaurants (supports search, filter, sort)
- `GET /:id` - Get single restaurant
- `POST /` - Create restaurant (admin only)
- `PUT /:id` - Update restaurant (admin only)
- `DELETE /:id` - Delete restaurant (admin only)
- `GET /:restaurantId/foods` - Get foods by restaurant

### Food Items (`/api/foods`)
- `GET /` - Get all food items (supports filters)
- `GET /:id` - Get single food item
- `POST /` - Create food item (admin only)
- `PUT /:id` - Update food item (admin only)
- `DELETE /:id` - Delete food item (admin only)

### Orders (`/api/orders`)
- `POST /` - Create new order (protected)
- `GET /myorders` - Get user's orders (protected)
- `GET /:id` - Get single order (protected)
- `GET /` - Get all orders (admin only)
- `PUT /:id/status` - Update order status (admin only)
- `PUT /:id/cancel` - Cancel order (protected)

## 🔐 Authentication Flow

1. **Frontend**: User submits login/register form
2. **Backend**: Validates credentials, generates JWT token
3. **Response**: Token sent in HttpOnly cookie + JSON response
4. **Storage**: User data stored in Zustand with persistence
5. **Requests**: Axios automatically includes cookie in requests
6. **Protection**: Protected routes check auth state before rendering

## 🛒 Cart & Checkout Flow

1. **Add to Cart**: Items stored in Zustand with persistence
2. **Cart Validation**: Prevents mixing items from different restaurants
3. **View Cart**: Review items, adjust quantities, see pricing
4. **Checkout**: Enter delivery address, select payment method
5. **Place Order**: Submit order to API, clear cart on success
6. **Order Confirmation**: Redirect to orders page

## 🎨 Design Highlights

- **Modern Gradient Backgrounds**: Orange to pink gradients throughout
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Glassmorphism**: Backdrop blur effects on modals and cards
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Hover effects, scale animations, loading states
- **Premium Typography**: Inter font for clean, modern look

## 📦 Key Components

### Frontend Components

- **Navbar**: Fixed header with cart badge and user menu
- **LoginModal**: Centered modal with login/signup toggle
- **Hero**: Landing page hero with animated backgrounds
- **RestaurantCard**: Restaurant preview with ratings and info
- **FoodCard**: Food item with add-to-cart button
- **ProtectedRoute**: HOC for authenticated pages

### Backend Features

- **Password Hashing**: Automatic bcrypt hashing on user creation
- **JWT Tokens**: 30-day expiration, HttpOnly cookies
- **Error Handling**: Centralized error middleware
- **Data Validation**: Mongoose schema validation
- **Query Filters**: Search, filter, and sort capabilities

## 🧪 Testing

### Test Credentials

After seeding the database:

**Admin Account**:
- Email: `admin@foodies.com`
- Password: `admin123`

**User Account**:
- Email: `john@example.com`
- Password: `password123`

### Test the Application

1. Register a new account or use test credentials
2. Browse restaurants on the landing page
3. Click on a restaurant to view menu
4. Add items to cart
5. Proceed to checkout
6. Place an order
7. View order history
8. Update profile information

## 🔧 Customization

### Adding New Restaurants

Use the seeding script or create via API:

```javascript
POST /api/restaurants
{
  "name": "New Restaurant",
  "description": "Amazing food",
  "image": "image-url",
  "cuisineType": ["Italian"],
  "address": { ... },
  "deliveryFee": 2.99
}
```

### Styling

- Modify `tailwind.config.ts` for theme changes
- Update color gradients in components
- Adjust animations in Framer Motion configs

## 🚀 Deployment

### Backend (Railway, Render, Heroku)

1. Set environment variables
2. Update `FRONTEND_URL` to production URL
3. Deploy with `npm start`

### Frontend (Vercel, Netlify)

1. Set `NEXT_PUBLIC_API_URL` to backend URL
2. Deploy with automatic Next.js detection

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer

Built with ❤️ by Roshan Basnet

---

**Happy Coding! 🍕🍔🍣**
