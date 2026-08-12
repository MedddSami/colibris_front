import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Leaf,
  Settings,
  Truck,
  Package,
} from "lucide-react";

export const userNavigation = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },

  {
    title: "Reservations",
    href: "/dashboard/reservations",
    icon: Calendar,
  },

  {
    title: "Book a Collection",
    href: "/dashboard/bookings",
    icon: Truck,
  },

  {
    title: "Packs",
    href: "/dashboard/packs",
    icon: Package,
  },

  {
    title: "Impact",
    href: "/dashboard/impact-actions",
    icon: Leaf,
  },

  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];