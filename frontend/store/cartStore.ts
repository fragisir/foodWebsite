import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem, Restaurant, CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    restaurant: Restaurant | null;
    addItem: (foodItem: FoodItem, quantity?: number) => void;
    removeItem: (foodItemId: string) => void;
    updateQuantity: (foodItemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    getTotal: (deliveryFee: number, tax: number) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            restaurant: null,

            addItem: (foodItem: FoodItem, quantity = 1) => {
                const { items, restaurant } = get();

                // Get restaurant info from foodItem
                const newRestaurant = typeof foodItem.restaurant === 'object'
                    ? foodItem.restaurant
                    : null;

                // If cart has items from different restaurant, clear it
                if (restaurant && newRestaurant && restaurant._id !== newRestaurant._id) {
                    const confirmed = confirm(
                        'Your cart contains items from another restaurant. Do you want to clear it?'
                    );
                    if (!confirmed) return;
                    set({ items: [], restaurant: null });
                }

                const existingItem = items.find(
                    (item) => item.foodItem._id === foodItem._id
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.foodItem._id === foodItem._id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...items, { foodItem, quantity }],
                        restaurant: newRestaurant || restaurant,
                    });
                }
            },

            removeItem: (foodItemId: string) => {
                const { items } = get();
                const newItems = items.filter((item) => item.foodItem._id !== foodItemId);
                set({
                    items: newItems,
                    restaurant: newItems.length === 0 ? null : get().restaurant,
                });
            },

            updateQuantity: (foodItemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(foodItemId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.foodItem._id === foodItemId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => {
                set({ items: [], restaurant: null });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.foodItem.price * item.quantity,
                    0
                );
            },

            getTotal: (deliveryFee: number, tax: number) => {
                return get().getSubtotal() + deliveryFee + tax;
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
