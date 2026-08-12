'use client'

import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AdminHeaderProps = {
    search: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
};

export default function AdminHeader({
    search,
    onSearchChange,
    placeholder = "Search...",
}: AdminHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());

        // remove anything else if you store it
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        router.replace("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-surface/80 px-8 backdrop-blur-xl">
            {/* Search */}
            <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    search
                </span>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-full bg-surface-container-high py-3 pl-12 pr-4 outline-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-primary"
                    >
                        {/*<img
                            src="/logo icône rvb.png"
                            alt="Admin"
                            className="h-full w-full object-cover"
                        />*/}
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95">

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                            >
                                <span className="material-symbols-outlined">
                                    logout
                                </span>

                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}