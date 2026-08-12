"use client"

import { authService } from "@/services/authService";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { Order, Reservation, User } from "@/types/api";
import { UserPointsResponse } from "@/types/order";
import { NextBookedCollectionResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link'
import ReservationDetailsModal from "@/components/modals/User/ReservationDetailsModal";

export default function DashboardPage() {

  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<UserPointsResponse | null>(null);

  const [shopOrders, setShopOrders] = useState<Order[]>([]);
  const [refillOrders, setRefillOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(true);

  const [nextCollection, setNextCollection] =
    useState<NextBookedCollectionResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"shop" | "refills" | "collections">(
    "collections"
  );

  const [showDetails, setShowDetails] = useState(false);

  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        user,
        points,
        shopOrders,
        refillOrders,
        reservations,
        nextCollection,
      ] = await Promise.all([
        authService.getProfile(),
        orderService.getUserPoints(),
        orderService.getUserShopOrders(),
        orderService.getUserRefillOrders(),
        userService.getHistory(),
        userService.getNextBookedCollection(),
      ]);

      setUser(user);
      setPoints(points);
      console.log(shopOrders, "shop orders")
      console.log(refillOrders, "refill orders")
      setShopOrders(shopOrders);
      setRefillOrders(refillOrders);
      setReservations(reservations);
      setNextCollection(nextCollection);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const reservation = nextCollection?.reservation;
  const collection = reservation?.collection;

  const formatCollectionDate = (date: string) => {
    const [day, month, year] = date.split("/");

    return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formattedDate = collection?.date
    ? formatCollectionDate(collection.date)
    : null;

  const formattedTime = reservation?.selectedTime
    ? reservation.selectedTime
    : null;

  const quickActions = [
    {
      label: "New Order",
      icon: "add_circle",
      href: "/shop",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      label: "New Collection",
      icon: "event_note",
      href: "/dashboard/bookings",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
  ];

  const last3 = (arr: any[] = []) => [...arr].slice(0, 3);
  const shopData = last3(shopOrders);
  const refillData = last3(refillOrders);
  const collectionData = last3(reservations);

  const getEcoLevel = (points: number) => {
    if (points < 500) return 1;
    if (points < 1500) return 2;
    return 3;
  };

  const getNextLevelTarget = (level: number) => {
    const map: Record<number, number> = {
      1: 500,
      2: 1500,
      3: 10000,
    };

    return map[level] ?? 1200;
  };

  const user_points = user?.points ?? 0;

  const level = getEcoLevel(user_points);

  const nextTarget = getNextLevelTarget(level);

  const prevTarget = level === 1 ? 0 : getNextLevelTarget(level - 1);

  const progress =
    ((user_points - prevTarget) / (nextTarget - prevTarget)) * 100;

  const formatOrders = (orders: any[]) =>
    orders.map((order) => ({
      id: order._id,
      title:
        order.items?.length > 0
          ? `${order.items.length} item${order.items.length > 1 ? "s" : ""}`
          : "Order",
      date: new Date(order.createdAt || order.deliveryDate).toLocaleDateString(),
      status: order.status,
      amount:
        order.paymentMethod === "points"
          ? `${order.totalPoints} pts`
          : `${order.totalPrice.toFixed(2)} TND`,
    }));

  const shopOrdersData = formatOrders(shopOrders);
  const refillordersData = formatOrders(refillOrders);

  const currentOrders =
    (
      activeTab === "shop"
        ? shopOrders
        : activeTab === "refills"
          ? refillOrders
          : []
    )
      .slice()
      .sort((a, b) =>
        new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
      )
      .slice(0, 2);



  const statusStyles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-yellow-100 text-yellow-700",
    delivered: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  function EmptyState({
    title,
    description,
    icon,
  }: {
    title: string;
    description: string;
    icon: string;
  }) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="material-symbols-outlined text-4xl text-slate-300">
          {icon}
        </span>

        <h4 className="mt-3 font-semibold text-slate-700">{title}</h4>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name}.
            </h1>

            <p className="text-slate-500 mt-2">
              Your biophilic journey has saved {user?.CO2Saved}kg of CO2 this month.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-semibold">
            ✨ {user?.badge}
          </div>
        </div>
      </section>

      {/* Stats + Booking */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="md:col-span-1 rounded-2xl bg-emerald-700 text-white p-6 shadow-dashboard relative overflow-hidden min-h-[180px]">
          <div className="relative ">
            <p className="text-xs uppercase tracking-widest opacity-80">
              Carbon Offset
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              {user?.CO2Saved.toFixed(2)}kg
            </h2>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
              Eco Contribution
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 text-[120px] opacity-10">
            ♻
          </div>
        </div>

        {/* Card 2 */}
        <div className="md:col-span-1 rounded-2xl bg-white p-6 shadow-dashboard min-h-[180px] flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Reward Points
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              {user?.points} points
            </h2>
          </div>

          <p className="text-sm font-semibold text-emerald-700">
            ✓ Verified
          </p>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-dashboard flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
              ⏰ Next Scheduled Collection
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              {collection?.title ?? "No upcoming collection"}
            </h3>

            <p className="mt-2 text-slate-500">
              {collection
                ? `${formattedDate} • ${formattedTime}`
                : "Book your next collection to keep earning eco points."}
            </p>

            <div className="mt-6 flex gap-3">

              <Link
                href="/dashboard/reservations"
                className="
                  rounded-full
                  bg-emerald-700
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:opacity-90
                "
              >
                Manage
              </Link>


              <button
                onClick={() => setShowDetails(true)}
                className="
                  rounded-full
                  bg-slate-100
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-200
                "
              >
                Details
              </button>

            </div>
          </div>

          <div className="h-40 md:h-auto md:w-40 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop"
              alt="Refill"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section >

      {/* Bottom Grid */}
      < section className="grid grid-cols-1 lg:grid-cols-3 gap-8" >
        {/* Orders */}
        <div className="lg:col-span-2 space-y-6" >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Orders & Collections History
            </h3>

            <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
              {[
                { key: "shop", label: "Shop" },
                { key: "refills", label: "Refills" },
                { key: "collections", label: "Collections" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1 text-md font-semibold rounded-lg transition ${activeTab === tab.key
                    ? "bg-white shadow text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-dashboard overflow-hidden">
            <div className="divide-y divide-slate-100">

              {(activeTab === "shop" || activeTab === "refills") && (
                <>
                  {currentOrders.length === 0 ? (
                    <EmptyState
                      icon={activeTab === "shop" ? "shopping_cart" : "water_drop"}
                      title={
                        activeTab === "shop"
                          ? "No shop orders yet"
                          : "No refill orders yet"
                      }
                      description={
                        activeTab === "shop"
                          ? "Your purchases will appear here once you place an order."
                          : "Your refill history will appear here."
                      }
                    />
                  ) : (
                    currentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-2xl border border-slate-200 p-5 hover:border-emerald-200 hover:bg-slate-50 transition-all"
                      >
                        <div className="flex justify-between gap-8">

                          {/* LEFT */}
                          <div className="flex-1">

                            {order.items.map((item) => (
                              <div key={item._id} className="mb-3">

                                <h4 className="font-semibold text-slate-900">
                                  {item.article.nom}
                                </h4>

                                <p className="text-sm text-slate-500">
                                  {item.quantity} {item.quantity > 1 ? "units" : "unit"}
                                  {item.volume && ` • ${item.volume}`}
                                </p>

                              </div>
                            ))}

                            <p className="text-xs text-slate-400">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>

                            <p className="text-xs text-slate-400">
                              Ordered {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                          </div>

                          {/* CENTER */}

                          <div className="min-w-[170px] border-l border-r border-slate-100 px-6">

                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              Payment
                            </p>

                            <p className="mt-2 text-xl font-bold text-slate-900">
                              {order.totalPrice.toFixed(2)} DT
                            </p>

                            <p className="mt-1 capitalize text-sm text-slate-500">
                              {order.paymentMethod}
                            </p>

                            {order.pointsUsed > 0 && (
                              <p className="mt-2 text-sm font-medium text-emerald-600">
                                {order.pointsUsed} reward pts used
                              </p>
                            )}

                          </div>

                          {/* RIGHT */}

                          <div className="min-w-[140px] flex flex-col items-end justify-between">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] ??
                                "bg-slate-100 text-slate-700"
                                }`}
                            >
                              {order.status}
                            </span>

                            <div className="text-right">

                              <p className="text-xs text-slate-400">
                                Delivery
                              </p>

                              <p className="font-medium">
                                {new Date(order.deliveryDate).toLocaleDateString()}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* FOOTER */}

                        <div className="mt-5 flex justify-between items-center border-t border-slate-100 pt-4">

                          <div
                            className="max-w-sm truncate text-sm text-slate-500"
                            title={order.userInfo.location}
                          >
                            📍 {order.userInfo.location}
                          </div>

                          <div className="flex gap-6 text-sm">

                            <span className="text-emerald-600">
                              +{order.totalCO2} kg CO2 offset
                            </span>

                            <span className="text-amber-500">
                              +{order.totalPoints} Reward points
                            </span>

                          </div>

                        </div>

                      </div>
                    ))
                  )}
                </>
              )}


              {/* COLLECTIONS (your real backend shape) */}
              {activeTab === "collections" && collectionData.length === 0 && (
                <EmptyState
                  icon="recycling"
                  title="No collections yet"
                  description="Your pickup reservations will show here."
                />
              )}
              {activeTab === "collections" &&
                collectionData.map((item) => {
                  const c = item.reservation;

                  const isPaid = c.isPaid;
                  const price = c.collection?.prix ?? 0;

                  return (
                    <div
                      key={item._id}
                      className="group flex items-center justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-200"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-start gap-4">
                        {/* ICON */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                          <span className="material-symbols-outlined">recycling</span>
                        </div>

                        {/* CONTENT */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900">
                              Pickup {c.collection?.title}
                            </h4>

                            {/* small status badge */}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                                }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {c.collectionType} • {c.selectedTime}
                          </p>

                          {/* META ROW */}
                          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              Price: {price > 0 ? `${price} TND` : "Free pickup"}
                            </span>

                            <span>Pickup Date: {new Date(item.bookedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex flex-col items-end gap-2">
                        {/* PAYMENT STATUS */}
                        <span
                          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isPaid ? "check_circle" : "schedule"}
                          </span>

                          {isPaid ? "Paid" : "Pending"}
                        </span>

                        {/* subtle hint */}
                        <p className="text-[11px] text-slate-400">
                          {isPaid ? "Payment completed" : "Waiting for payment"}
                        </p>
                      </div>
                    </div>
                  );
                })}

            </div>
          </div>
        </div >

        {/* Right Side */}
        < div className="space-y-8" >
          {/* Quick Actions */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-slate-900">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="rounded-2xl bg-white p-5 shadow-dashboard transition hover:bg-slate-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${action.iconBg} ${action.iconColor}`}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {action.icon}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      {action.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div >

          {/* Eco Progress */}
          <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-600 p-6 text-white shadow-dashboard">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <h4 className="font-bold">Next Badge Level</h4>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Level {level}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="mt-6 space-y-3">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-teal-200 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <p className="text-sm text-white/80">
                {user_points}/{nextTarget} points earned.
                {" "}
                {nextTarget - user_points > 0
                  ? `${nextTarget - user_points} points to next level`
                  : "Max level reached 🎉"}
              </p>
            </div>

            {/* BADGE INFO */}
            <div className="mt-4 flex items-center justify-between text-sm text-white/80">
              <span>Badge: {user?.badge ?? "Starter"}</span>

              <span>Free Collectes: {user?.freeCollectes ?? 0}</span>
            </div>

            {/* BUTTON 
            <button className="mt-6 w-full rounded-xl bg-teal-200 py-3 font-semibold text-teal-900 transition hover:opacity-90">
              Explore Benefits
            </button>*/}
          </div>
        </div >
      </section >
      <ReservationDetailsModal
        reservation={nextCollection?.reservation}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div >
  );
}