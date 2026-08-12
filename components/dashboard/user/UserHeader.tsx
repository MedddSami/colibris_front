'use client'

import { cartService } from "@/services/CartService";
import {
    Bell,
    Search,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserHeader() {

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const [normalCart, refillCart] = await Promise.all([
                    cartService.getCart(),
                    cartService.getRefillCart(),
                ]);

                const normalCount = normalCart.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );

                const refillCount = refillCart.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );

                setCartCount(normalCount + refillCount);
            } catch (error) {
                console.error("Failed to fetch cart count:", error);
            }
        };

        fetchCartCount();
    }, []);


    return (
        <header className="sticky top-0 z-10 bg-slate-200/80 backdrop-blur border-b border-slate-100">
            <div className="max-w-10xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                    User Dashboard
                </h2>

                {/* Cart */}
                <Link
                    href="/cart"
                    className="text-on-surface-variant hover:text-primary scale-95 active:opacity-80 transition-transform"
                    aria-label="Shopping cart"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {/* Cart count */}
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-white px-1">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}

function IconButton({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            className={`h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm ${className}`}
        >
            {children}
        </button>
    );
}