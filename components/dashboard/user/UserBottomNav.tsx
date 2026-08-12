"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { userNavigation } from "./data/navigation";

export default function UserBottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex justify-around py-3">
                {userNavigation.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 ${active
                                ? "text-primary"
                                : "text-slate-400"
                                }`}
                        >
                            <Icon size={20} />

                            <span className="text-[10px] font-bold">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}