# 🚀 Quick Start Guide - Foodies App

Get up and running in 5 minutes!

## 📋 Prerequisites Check

Make sure you have:
- ✅ Node.js installed (`node --version`)
- ✅ MongoDB installed and running (`mongod --version`)

## ⚡ Quick Setup (Both Backend & Frontend)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Dependencies are already installed!
# Start MongoDB (in a separate terminal)
mongod

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

**Backend will run on**: `http://localhost:5000`

✅ **Test backend**: Visit `http://localhost:5000/api/health`

---

### Step 2: Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Dependencies are already installed!
# Start the frontend
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

---

## 🎉 You're Ready!

Visit **http://localhost:3000** and you'll see the Foodies landing page!

## 🧪 Test Accounts

After running the seed script, use these credentials:

### Admin Account
- **Email**: admin@foodies.com
- **Password**: admin123

### User Account
- **Email**: john@example.com  
- **Password**: password123

## 🎯 Quick Tour

1. **Landing Page** → See featured restaurants
2. **Click "Login"** → Use test credentials
3. **Browse Restaurants** → View all available restaurants
4. **Click a Restaurant** → See menu items
5. **Add to Cart** → Click + button on food items
6. **View Cart** → Cart icon in navbar
7. **Checkout** → Fill delivery address, place order
8. **My Orders** → See order history
9. **Profile** → Update your information

## 🛠️ Important Commands

### Backend
```bash
npm run dev      # Start development server
npm run seed     # Seed database with sample data
npm run seed -d  # Destroy all data
npm start        # Production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

## 📊 Database Access

If you want to view the MongoDB data:

```bash
# Using MongoDB Compass
mongodb://localhost:27017/foodies

# Using mongo shell
mongo
use foodies
db.restaurants.find()
db.fooditems.find()
db.users.find()
db.orders.find()
```

## 🐛 Troubleshooting

### Backend won't start?
- ✅ Make sure MongoDB is running: `mongod`
- ✅ Check if port 5000 is available
- ✅ Verify `.env` file exists in backend folder

### Frontend won't start?
- ✅ Check if port 3000 is available
- ✅ Verify `.env.local` file exists in frontend folder
- ✅ Make sure backend is running first

### "Cannot connect to MongoDB"?
- ✅ Start MongoDB: `mongod`
- ✅ Check connection string in `backend/.env`
- ✅ Verify MongoDB is running: `mongo --eval "db.version()"`

### "API calls failing"?
- ✅ Backend must be running on port 5000
- ✅ Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- ✅ Look for CORS errors in browser console

## 🎨 Features to Test

✅ **Authentication**
- Register new account
- Login with existing account
- Logout

✅ **Browsing**
- Search restaurants
- Filter by category
- View restaurant details
- Browse menu items

✅ **Shopping**
- Add items to cart
- Update quantities
- Remove items
- View cart summary

✅ **Ordering**
- Checkout process
- Enter delivery address
- Select payment method
- Place order
- View order history

✅ **Profile**
- View profile
- Edit information
- Update address

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:
- Press `Cmd+Option+I` (Mac) or `F12` (Windows) in browser
- Click device toggle icon
- Select a mobile device

## 🚀 Next Steps

1. ⭐ Customize the theme colors
2. 🍕 Add more restaurants and menu items
3. 📸 Upload custom images
4. 🎨 Modify the UI to your liking
5. 🔒 Add more security features
6. 📊 Add admin dashboard
7. 💳 Integrate real payment gateway

## 💡 Pro Tips

- Use **React DevTools** to inspect component state
- Check **Network tab** to see API calls
- Use **Redux DevTools** for Zustand debugging
- Keep both terminals (backend & frontend) open
- Use **MongoDB Compass** for visual database management

---

**Enjoy building with Foodies! 🍔🍕🍣**

Need help? Check the main [README.md](./README.md) for detailed documentation.
