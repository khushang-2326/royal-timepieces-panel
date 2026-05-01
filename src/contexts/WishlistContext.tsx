import API_URL from '@/config';
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface WishlistItem {
    id: string;
    name: string;
    price: string;
    image: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    toggleWishlist: (item: WishlistItem) => void;
    refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const navigate = useNavigate();

    const refreshWishlist = () => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`${API_URL}/users/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.wishlist) setWishlistItems(data.wishlist);
                })
                .catch(err => console.error("Failed to fetch user wishlist", err));
        } else {
            const savedWishlist = localStorage.getItem("wishlist");
            if (savedWishlist) {
                try {
                    setWishlistItems(JSON.parse(savedWishlist));
                } catch (error) {
                    console.error("Failed to parse wishlist from local storage", error);
                }
            } else {
                setWishlistItems([]);
            }
        }
    };

    // Load wishlist from local storage or backend on mount
    useEffect(() => {
        refreshWishlist();
    }, []);

    // Save wishlist to local storage and backend whenever it changes
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`${API_URL}/users/${user.id}/wishlist`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wishlist: wishlistItems })
            }).catch(err => console.error("Failed to sync wishlist", err));
        } else {
            localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        }
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            toast.error("Please sign in to add items to wishlist");
            navigate("/auth");
            return;
        }
        setWishlistItems((prev) => [...prev, item]);
        toast.success("Added to wishlist");
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Removed from wishlist");
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item.id === id);
    };

    const toggleWishlist = (item: WishlistItem) => {
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(item);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

