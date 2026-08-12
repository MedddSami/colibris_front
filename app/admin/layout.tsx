'use client'

import { ReactNode } from "react";
import AdminDashboardLayout from "@/components/dashboard/admin/AdminDashboardLayout";
import AdminRoute from "@/components/auth/AdminRoute";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminRoute>
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
    </AdminRoute>
  );
}