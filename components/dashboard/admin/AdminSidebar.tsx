"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "./navigation/navigation";
import Image from "next/image";

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 border-r border-outline-variant/10 bg-surface-container-low">
            <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
                {/* Logo */}
                <div className="mb-5">
                    <Link href="/">
                        <Image
                            src="/logo_horizontal_+_tagline_rvb.png"
                            alt="Colibris"
                            width={160}
                            height={48}
                            className="object-contain cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {adminNavigation.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 rounded-xl p-3 transition-all
                                    ${active
                                        ? "bg-surface-container-lowest text-primary shadow-lg"
                                        : "text-on-surface-variant hover:bg-surface-container-high"
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {item.icon}
                                </span>

                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}