import UserDashboardLayout from "@/components/dashboard/user/UserDashboardLayout";
import { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserDashboardLayout>
      {children}
    </UserDashboardLayout>
  );
}