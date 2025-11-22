# 🔗 Frontend-Backend Integration Examples

This document shows how the Foodies frontend communicates with the backend API.

## 🛠️ API Client Setup

We use **Axios** as our HTTP client with automatic cookie handling.

### Configuration (`lib/api.ts`)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
});
```

## 🔐 Authentication Examples

### 1. User Login

**Frontend Code**:
```typescript
// In authStore.ts or component
const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    const { user, token } = response.data;
    // Token is automatically stored in HttpOnly cookie
    // Store user in state
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

**Backend Endpoint**:
```javascript
POST http://localhost:5000/api/auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Cookies Set**:
```
Set-Cookie: token=<jwt_token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
```

### 2. User Registration

**Frontend Code**:
```typescript
const register = async (name: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
    });
    
    const { user, token } = response.data;
    // Auto login after registration
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
  } catch (error) {
    throw error;
  }
};
```

**Backend Endpoint**:
```javascript
POST http://localhost:5000/api/auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as login
```

### 3. Logout

**Frontend Code**:
```typescript
const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local state regardless
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }
};
```

**Backend Endpoint**:
```javascript
POST http://localhost:5000/api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🍽️ Restaurant Examples

### 1. Fetch All Restaurants

**Frontend Code**:
```typescript
const fetchRestaurants = async () => {
  try {
    const response = await apiClient.get('/restaurants');
    setRestaurants(response.data.data);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};
```

**With Search/Filter**:
```typescript
const searchRestaurants = async (query: string) => {
  const response = await apiClient.get(
    `/restaurants?search=${encodeURIComponent(query)}`
  );
  return response.data.data;
};

const filterByCuisine = async (cuisine: string) => {
  const response = await apiClient.get(
    `/restaurants?cuisine=${encodeURIComponent(cuisine)}`
  );
  return response.data.data;
};

const getFeatured = async () => {
  const response = await apiClient.get('/restaurants?featured=true');
  return response.data.data;
};
```

**Backend Endpoints**:
```javascript
GET http://localhost:5000/api/restaurants
GET http://localhost:5000/api/restaurants?search=pizza
GET http://localhost:5000/api/restaurants?cuisine=Italian
GET http://localhost:5000/api/restaurants?featured=true
GET http://localhost:5000/api/restaurants?sort=rating

Response:
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "name": "Pizza Palace",
      "description": "...",
      "image": "...",
      "cuisineType": ["Italian", "Pizza"],
      "rating": 4.7,
      "deliveryTime": "25-35 mins",
      ...
    },
    ...
  ]
}
```

### 2. Fetch Single Restaurant

**Frontend Code**:
```typescript
const fetchRestaurant = async (id: string) => {
  try {
    const response = await apiClient.get(`/restaurants/${id}`);
    setRestaurant(response.data.data);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
  }
};
```

**Backend Endpoint**:
```javascript
GET http://localhost:5000/api/restaurants/6583d9f2a4b8c9001f8e4567

Response:
{
  "success": true,
  "data": {
    "_id": "6583d9f2a4b8c9001f8e4567",
    "name": "Pizza Palace",
    ...
  }
}
```

## 🍕 Food Items Examples

### 1. Fetch Menu Items by Restaurant

**Frontend Code**:
```typescript
const fetchMenuItems = async (restaurantId: string) => {
  try {
    const response = await apiClient.get(
      `/foods?restaurant=${restaurantId}`
    );
    setFoodItems(response.data.data);
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
};
```

**Alternative Route**:
```typescript
const response = await apiClient.get(
  `/restaurants/${restaurantId}/foods`
);
```

**Backend Endpoints**:
```javascript
GET http://localhost:5000/api/foods?restaurant=6583d9f2a4b8c9001f8e4567
GET http://localhost:5000/api/restaurants/6583d9f2a4b8c9001f8e4567/foods

Response:
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "...",
      "restaurant": "6583d9f2a4b8c9001f8e4567",
      "name": "Margherita Pizza",
      "description": "...",
      "price": 14.99,
      "category": "Pizza",
      "rating": 4.7,
      ...
    },
    ...
  ]
}
```

### 2. Filter Food Items

**Frontend Code**:
```typescript
// Popular items
const response = await apiClient.get('/foods?popular=true');

// Vegetarian items
const response = await apiClient.get('/foods?vegetarian=true');

// By category
const response = await apiClient.get('/foods?category=Pizza');

// Search
const response = await apiClient.get('/foods?search=pasta');

// Sort by price
const response = await apiClient.get('/foods?sort=price-low');
```

## 🛒 Order Placement Example

### Complete Order Flow

**Frontend Code**:
```typescript
const placeOrder = async () => {
  const { items, restaurant } = cartStore;
  const { user } = authStore;
  
  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );
  const deliveryFee = restaurant.deliveryFee;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  
  // Prepare order data
  const orderData = {
    restaurant: restaurant._id,
    items: items.map(item => ({
      foodItem: item.foodItem._id,
      name: item.foodItem.name,
      price: item.foodItem.price,
      quantity: item.quantity,
    })),
    deliveryAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "card",
    subtotal,
    deliveryFee,
    tax,
    total,
    specialInstructions: "Ring the doorbell twice",
  };
  
  try {
    const response = await apiClient.post('/orders', orderData);
    const order = response.data.data;
    
    // Clear cart
    clearCart();
    
    // Redirect to orders page
    router.push('/orders');
    
    toast.success('Order placed successfully!');
  } catch (error) {
    toast.error('Failed to place order');
  }
};
```

**Backend Endpoint**:
```javascript
POST http://localhost:5000/api/orders

Headers:
Cookie: token=<jwt_token>

Request Body:
{
  "restaurant": "6583d9f2a4b8c9001f8e4567",
  "items": [
    {
      "foodItem": "6583da15a4b8c9001f8e4568",
      "name": "Margherita Pizza",
      "price": 14.99,
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "card",
  "subtotal": 29.98,
  "deliveryFee": 2.99,
  "tax": 2.40,
  "total": 35.37,
  "specialInstructions": "Ring the doorbell twice"
}

Response:
{
  "success": true,
  "data": {
    "_id": "6583da88a4b8c9001f8e4569",
    "user": "...",
    "restaurant": "...",
    "items": [...],
    "status": "pending",
    "estimatedDeliveryTime": "2024-01-15T14:30:00.000Z",
    "total": 35.37,
    ...
  }
}
```

## 📦 Fetch User Orders

**Frontend Code**:
```typescript
const fetchMyOrders = async () => {
  try {
    const response = await apiClient.get('/orders/myorders');
    setOrders(response.data.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};
```

**Backend Endpoint**:
```javascript
GET http://localhost:5000/api/orders/myorders

Headers:
Cookie: token=<jwt_token>

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "restaurant": {
        "_id": "...",
        "name": "Pizza Palace",
        "image": "..."
      },
      "items": [...],
      "status": "delivered",
      "total": 35.37,
      "createdAt": "2024-01-15T13:00:00.000Z",
      ...
    },
    ...
  ]
}
```

## 👤 Update User Profile

**Frontend Code**:
```typescript
const updateProfile = async (profileData: any) => {
  try {
    const response = await apiClient.put('/auth/updateprofile', {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
    });
    
    setUser(response.data.data);
    toast.success('Profile updated!');
  } catch (error) {
    toast.error('Failed to update profile');
  }
};
```

**Backend Endpoint**:
```javascript
PUT http://localhost:5000/api/auth/updateprofile

Headers:
Cookie: token=<jwt_token>

Request Body:
{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "phone": "555-1234",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001"
  }
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe Updated",
    "email": "john.new@example.com",
    ...
  }
}
```

## 🔒 Protected API Calls

All protected endpoints require authentication. The JWT token is automatically sent via HttpOnly cookies.

**Example of Protected Call**:
```typescript
// The cookie is automatically included
const response = await apiClient.get('/orders/myorders');

// Axios interceptor handles 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

## 📊 Error Handling

**Frontend Pattern**:
```typescript
try {
  const response = await apiClient.post('/orders', orderData);
  // Success handling
  toast.success('Order placed!');
} catch (error: any) {
  // Extract error message
  const message = 
    error.response?.data?.message ||
    error.response?.data?.error ||
    'Something went wrong';
  
  toast.error(message);
}
```

**Backend Error Responses**:
```javascript
// Validation Error
{
  "success": false,
  "error": "Please provide an email and password"
}

// Not Found
{
  "success": false,
  "message": "Restaurant not found"
}

// Unauthorized
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

## 🎯 Best Practices

1. **Always use try-catch** for API calls
2. **Show loading states** during requests
3. **Handle errors gracefully** with user-friendly messages
4. **Use toast notifications** for user feedback
5. **Implement retry logic** for failed requests
6. **Cache responses** where appropriate
7. **Debounce search inputs** to reduce API calls
8. **Validate data** before sending to API

---

**That's it! 🚀** You now know how the Frontend and Backend communicate in Foodies!
