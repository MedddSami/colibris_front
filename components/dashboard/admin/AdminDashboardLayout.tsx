'use client'

import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AdminBottomNav from "./AdminBottomNav";

interface Props {
    children: ReactNode | ((search: string) => ReactNode);
}

export default function AdminDashboardLayout({
    children,
}: Props) {
    const [search, setSearch] = useState("");

    return (
        <div className="bg-background text-on-background">
            <AdminSidebar />

            <main className="ml-72 min-h-screen">
                <AdminHeader
                    search={search}
                    onSearchChange={setSearch}
                    placeholder="Find users, orders, reservations..."
                />

                <div className="px-10 pt-10">
                    {typeof children === "function"
                        ? children(search)
                        : children}
                </div>

                <AdminFooter />
            </main>
            {/*<AdminBottomNav />*/}
        </div>
    );
}
