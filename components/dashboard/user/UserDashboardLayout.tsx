import { ReactNode } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import UserBottomNav from "./UserBottomNav";
import UserDashboardFooter from "./UserFooter";


export default function UserDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <UserSidebar />

            <div className="flex flex-1 flex-col">
                <UserHeader />

                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>

                <UserDashboardFooter />
            </div>

            <UserBottomNav />
        </div>
    );
}