import API_URL from '@/config';
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    cartItemCount: number;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    const refreshCart = () => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`${API_URL}/users/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.cart) setCartItems(data.cart);
                })
                .catch(err => console.error("Failed to fetch user cart", err));
        } else {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error("Failed to parse cart from local storage", error);
                }
            } else {
                setCartItems([]);
            }
        }
    };

    // Load cart from local storage or backend on mount
    useEffect(() => {
        refreshCart();
    }, []);

    // Save cart to local storage and backend whenever it changes
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Only sync if cartItems is not empty, OR if we want to sync empty cart too.
            // But we need to be careful not to overwrite DB with empty cart on initial load before fetch.
            // However, since we fetch on mount, subsequent updates should be valid.
            // To be safe, maybe we should have a 'loaded' state?
            // For now, let's assume fetch happens fast enough or we accept the risk.
            // Actually, the issue is: if we fetch, setCartItems triggers this effect.
            // If we fetch empty cart from DB, it sets cartItems to [], which triggers this effect to save [] to DB. That's fine.

            fetch(`${API_URL}/users/${user.id}/cart`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cartItems })
            }).catch(err => console.error("Failed to sync cart", err));
        } else {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            toast.error("Please sign in to add items to cart");
            navigate("/auth");
            return;
        }

        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success("Added to cart");
        navigate("/cart");
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartOpen,
                setCartOpen,
                cartItemCount,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

