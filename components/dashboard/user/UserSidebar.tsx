"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { userNavigation } from "./data/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { User } from "@/types/api";
import { authService } from "@/services/authService";
import { logout } from "@/store/slices/authSlice";


export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    router.replace("/");
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-200 border-r border-slate-100 shadow-dashboard sticky top-0 h-screen">
      <div className="px-8 py-8">
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

      <nav className="flex-1 px-4 space-y-2">
        {userNavigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl p-3 transition-all
                ${active
                  ? "bg-surface-container-lowest text-primary/140 shadow-lg"
                  : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-6">
        <div className="flex items-center gap-3">

          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-bold">
              {loading ? "Loading..." : user?.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.badge ?? "Member"}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <span className="material-symbols-outlined">
              logout
            </span>
          </button>

        </div>
      </div>
    </aside>
  );
}