// Type definitions for Foodies application

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: string;
    phone?: string;
    address?: Address;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
}

export interface Restaurant {
    _id: string;
    name: string;
    description: string;
    image: string;
    cuisineType: string[];
    address: Address & {
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    isOpen: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FoodItem {
    _id: string;
    restaurant: string | Restaurant;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    isVegetarian: boolean;
    isVegan: boolean;
    spicyLevel: number;
    calories?: number;
    rating: number;
    reviewCount: number;
    available: boolean;
    popular: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    foodItem: FoodItem;
    quantity: number;
}

export interface Order {
    _id: string;
    user: string | User;
    restaurant: string | Restaurant;
    items: OrderItem[];
    deliveryAddress: Address;
    paymentMethod: 'card' | 'cash' | 'paypal';
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    specialInstructions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    foodItem: string | FoodItem;
    name: string;
    price: number;
    quantity: number;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Review {
    _id: string;
    user: User;
    restaurant: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
    error?: string;
}
