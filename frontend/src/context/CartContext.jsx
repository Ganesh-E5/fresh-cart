import { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

const CART_STORAGE_KEY = "freshcart-cart";

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const getItemQty = (variantId) => {
        const item = items.find((i) => i.variantId === variantId);
        return item ? item.qty : 0;
    };

    const addItem = (variant) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === variant._id);
            if (existing) {
                return prev.map((i) =>
                    i.variantId === variant._id
                        ? { ...i, qty: Math.min(i.qty + 1, i.stock) }
                        : i
                );
            }
            return [
                ...prev,
                {
                    variantId: variant._id,
                    name: variant.product_id?.name || "Product",
                    img_url: variant.img_url,
                    sp: variant.sp,
                    mrp: variant.mrp,
                    unit: variant.unit,
                    size: variant.size,
                    stock: variant.qty,
                    qty: 1,
                },
            ];
        });
    };

    const increment = (variantId) => {
        setItems((prev) =>
            prev.map((i) =>
                i.variantId === variantId
                    ? { ...i, qty: Math.min(i.qty + 1, i.stock) }
                    : i
            )
        );
    };

    const decrement = (variantId) => {
        setItems((prev) =>
            prev
                .map((i) =>
                    i.variantId === variantId ? { ...i, qty: i.qty - 1 } : i
                )
                .filter((i) => i.qty > 0) 
        );
    };

    const removeItem = (variantId) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
    const cartTotal = items.reduce((sum, i) => sum + i.sp * i.qty, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                getItemQty,
                addItem,
                increment,
                decrement,
                removeItem,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}