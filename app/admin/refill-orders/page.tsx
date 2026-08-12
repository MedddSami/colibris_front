"use client";

import { orderService } from "@/services/orderService";
import { refillService } from "@/services/refillService";
import { Order, RefillArticle } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Row({
  label,
  value,
  bold = false
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-on-surface-variant">
        {label}
      </span>

      <span className={bold ? "font-bold" : ""}>
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-4">

      <span className="material-symbols-outlined text-primary">
        {icon}
      </span>

      <p className="text-label-md text-on-surface-variant mt-2">
        {label}
      </p>

      <p className="font-bold truncate">
        {value}
      </p>

    </div>
  );
}


export default function RefillOrdersPage() {

  const [refillOrders, setRefillOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderArticles, setOrderArticles] = useState<Record<string, RefillArticle>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await orderService.getAdminRefillOrders();
      console.log(data, "refill orders")

      setRefillOrders(data);
    } catch (err) {
      console.error("Failed to fetch refill orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mappedRefillOrders = refillOrders.map((order) => {
    const name = order.userInfo.name;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return {
      id: order._id,
      name,
      initials,
      tier: "Eco Member", // placeholder (or derive later)
      product: order.items?.[0]?.article || "Refill Product",
      volume: order.items?.[0]?.volume || "-",
      location: order.userInfo.location,
      status: order.status,
      statusClass:
        order.status === "pending"
          ? "bg-surface-container text-on-surface"
          : order.status === "confirmed"
            ? "bg-primary-container text-primary"
            : "bg-error-container text-error",
      avatarClass: "bg-secondary-container text-on-secondary-container",
    };
  });

  const ORDERS_PER_PAGE = 4;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(refillOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = refillOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );


  const totalVolume = refillOrders.reduce((sum, order) => {
    const volume = order.items?.[0]?.volume;

    const numeric = parseFloat(volume || "0");
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  const thisMonth = refillOrders.filter((o) => {
    const d = new Date(o.deliveryDate);
    return d.getMonth() === new Date().getMonth();
  }).length;

  const lastMonth = refillOrders.filter((o) => {
    const d = new Date(o.deliveryDate);
    const last = new Date();
    last.setMonth(last.getMonth() - 1);
    return d.getMonth() === last.getMonth();
  }).length;

  const growth =
    lastMonth === 0
      ? 0
      : ((thisMonth - lastMonth) / lastMonth) * 100;


  const volumeByProduct = refillOrders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const productName =
        typeof item.article === "object"
          ? item.article.nom
          : "Unknown Product";

      const volume = parseFloat(item.volume || "0") * item.quantity;

      if (!acc[productName]) {
        acc[productName] = 0;
      }

      acc[productName] += isNaN(volume) ? 0 : volume;
    });

    return acc;
  }, {} as Record<string, number>);

  const total_volume = Object.values(volumeByProduct).reduce(
    (sum, value) => sum + value,
    0
  );

  const volumeSplit = Object.entries(volumeByProduct)
    .sort(([, a], [, b]) => b - a)
    .map(([label, value]) => ({
      label,
      value,
      percentage:
        totalVolume === 0
          ? 0
          : (value / total_volume) * 100,
    }));

  const hubStats = refillOrders.reduce((acc, order) => {
    const hub = order.userInfo.location;

    if (!acc[hub]) {
      acc[hub] = {
        orders: 0,
        volume: 0,
      };
    }

    acc[hub].orders += 1;

    order.items.forEach((item) => {
      const volume =
        parseFloat(item.volume || "0") * item.quantity;

      acc[hub].volume += isNaN(volume) ? 0 : volume;
    });

    return acc;
  }, {} as Record<string, { orders: number; volume: number }>);

  const hubs = Object.entries(hubStats)
    .map(([name, stats]) => ({
      name,
      ...stats,
    }))
    .sort((a, b) => b.volume - a.volume);

  const HUB_CAPACITY = 1000;

  const logisticsData = hubs.slice(0, 5).map((hub) => ({
    ...hub,
    percentage: Math.min(
      (hub.volume / HUB_CAPACITY) * 100,
      100
    ),
  }));

  const bottlesSaved = Math.round(totalVolume * 1.3);

  const paymentClasses = {
    money: "bg-blue-100 text-blue-700",
    points: "bg-amber-100 text-amber-700",
    hybrid: "bg-purple-100 text-purple-700",
  };

  const openOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingDetails(true);

    try {
      const articles: Record<string, RefillArticle> = {};

      await Promise.all(
        order.items.map(async (item) => {
          const article = await refillService.getRefillArticleById(
            item.article._id
          );

          articles[item.article] = article;
        })
      );

      setOrderArticles(articles);
    } catch (error) {
      console.error("Failed to load article details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Main */}
      <main className="flex-1 relative min-h-screen">

        {/* Content */}
        <div className="p-2 max-w-12xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-5xl font-bold tracking-tight text-primary">
                Refill Orders
              </h2>

              <p className="text-body-lg text-on-surface-variant">
                Manage circular logistics and volume-based liquid refill
                operations.
              </p>
            </div>

            <button className="px-6 py-3 rounded-full border border-outline-variant/20 text-secondary font-bold flex items-center gap-2 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">
                download
              </span>

              Export Orders Report
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0px_12px_32px_rgba(20,29,32,0.06)] overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-label-md font-bold uppercase tracking-widest text-secondary opacity-70 mb-4">
                  Circular Volume This Month
                </p>

                <div className="flex items-baseline gap-4">
                  <span className="text-[5rem] font-extrabold leading-none tracking-tighter text-primary">
                    <span className="text-[5rem] font-extrabold text-primary">
                      {totalVolume.toFixed(0)}
                    </span>
                  </span>

                  <span className="text-2xl font-bold text-on-surface-variant">
                    Liters
                  </span>
                </div>

                <div className="mt-8 flex gap-8">
                  <div>
                    <p className="text-label-md text-on-surface-variant">
                      Increase from last month
                    </p>

                    <p className="text-title-lg font-bold text-primary-container">
                      {growth >= 0 ? "+" : ""}
                      {growth.toFixed(1)}%
                    </p>
                  </div>

                  <div className="h-12 w-px bg-outline-variant/20" />

                  <div>
                    <p className="text-label-md text-on-surface-variant">
                      Plastic bottles saved
                    </p>

                    <p className="text-title-lg font-bold text-secondary">
                      ~{Math.round(totalVolume * 1.3)} units
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Volume Split */}
            <div className="col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-[2rem] p-8 shadow-[0px_12px_32px_rgba(0,108,74,0.1)]">
              <h3 className="text-2xl font-bold mb-6">
                Volume Split
              </h3>

              {volumeSplit.length === 0 ? (
                <div className="py-12 text-center opacity-80">
                  <span className="material-symbols-outlined text-5xl mb-3">
                    water_drop
                  </span>

                  <p>No refill volume yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {volumeSplit.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-label-md font-bold mb-2">
                        <span>{item.label}</span>

                        <span>
                          {item.value.toFixed(1)} L
                        </span>
                      </div>

                      <div className="h-2 w-full bg-on-primary-container/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-700"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs opacity-80">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-surface-container-low rounded-[2rem] p-4">
            <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 text-left">
                    {[
                      "Order",
                      "Customer",
                      "Products",
                      "Payment",
                      "Delivery",
                      //"Rewards",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-5 text-label-md font-bold text-on-surface-variant uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-surface-container">
                  {paginatedOrders.length === 0 ? (

                    <tr>
                      <td
                        colSpan={7}
                        className="px-8 py-16 text-center"
                      >
                        <div className="flex flex-col items-center gap-3 text-on-surface-variant">

                          <span className="material-symbols-outlined text-5xl opacity-40">
                            local_shipping
                          </span>

                          <p className="text-lg font-semibold text-on-surface">
                            No refill orders yet
                          </p>

                          <p className="text-sm">
                            Refill orders will appear here once customers schedule deliveries.
                          </p>

                        </div>
                      </td>
                    </tr>

                  ) : (
                    refillOrders.map((order) => {
                      const statusClasses = {
                        pending: "bg-yellow-100 text-yellow-700",
                        accepted: "bg-blue-100 text-blue-700",
                        preparing: "bg-purple-100 text-purple-700",
                        delivered: "bg-green-100 text-green-700",
                        cancelled: "bg-red-100 text-red-700",
                      };

                      return (
                        <tr
                          key={order._id}
                          className="hover:bg-surface-container-low/30 transition-colors"
                        >
                          {/* ORDER */}
                          <td className="px-6 py-6">
                            <p className="font-bold text-primary">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>

                            <p className="text-sm text-on-surface-variant">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <p className="text-xs text-on-surface-variant capitalize">
                              {order.type}
                            </p>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-6 py-6">
                            <p className="font-semibold">
                              {order.userInfo?.name}
                            </p>

                            <p className="text-sm text-on-surface-variant">
                              {order.userInfo?.email}
                            </p>

                            <p className="text-sm text-on-surface-variant">
                              📞 {order.userInfo?.number}
                            </p>
                          </td>

                          {/* PRODUCTS */}
                          <td className="px-6 py-6">
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item._id}>
                                  <p className="font-medium">
                                    {item.article?.nom}
                                  </p>

                                  <p className="text-sm text-on-surface-variant">
                                    {item.quantity} × {item.volume}
                                  </p>

                                  <p className="text-xs text-on-surface-variant">
                                    {item.price.toFixed(2)} DT • {item.points} pts
                                  </p>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* PAYMENT */}
                          <td className="px-6 py-6">
                            <p className="font-bold text-primary">
                              {order.totalPrice.toFixed(2)} DT
                            </p>

                            <p className="text-sm capitalize text-on-surface-variant">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${paymentClasses[order.paymentMethod] ??
                                  "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {order.paymentMethod}
                              </span>
                            </p>

                            {order.pointsUsed > 0 && (
                              <p className="text-sm text-green-600 font-medium">
                                {order.pointsUsed} pts used
                              </p>
                            )}

                            <p className="text-xs text-on-surface-variant">
                              Delivery:{" "}
                              {order.deliveryFee === 0
                                ? "Free"
                                : `${order.deliveryFee} DT`}
                            </p>
                          </td>

                          {/* DELIVERY */}
                          <td className="px-6 py-6">
                            <p className="font-medium">
                              {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>

                            <p className="text-sm capitalize text-on-surface-variant">
                              {order.deliveryOption}
                            </p>

                            <p
                              className="text-xs text-on-surface-variant max-w-[220px] truncate"
                              title={order.userInfo?.location}
                            >
                              📍 {order.userInfo?.location}
                            </p>
                          </td>

                          {/* REWARDS 
                        <td className="px-6 py-6">
                          <p className="text-green-600 font-medium">
                            🌱 {order.totalCO2} kg
                          </p>

                          <p className="text-amber-600 font-medium">
                            ⭐ {order.totalPoints} pts
                          </p>
                        </td>
                        */}

                          {/* STATUS */}
                          <td className="px-6 py-6">
                            <span
                              className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ${statusClasses[order.status] ??
                                "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="px-6 py-6">
                            <div className="flex justify-end gap-2">

                              {/* VIEW */}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderDetails(order);
                                }}
                                className="p-2 rounded-xl hover:bg-primary-container text-primary"
                              >
                                <span className="material-symbols-outlined">
                                  visibility
                                </span>
                              </button>

                              {/* CONFIRM */}

                              {order.status === "pending" && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();

                                    try {

                                      setLoadingAction(order._id);

                                      await orderService.confirmOrder(order._id);

                                      fetchOrders();

                                    } finally {

                                      setLoadingAction(null);

                                    }
                                  }}
                                  disabled={loadingAction === order._id}
                                  className="p-2 rounded-xl hover:bg-green-100 text-green-600 disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined">
                                    check
                                  </span>
                                </button>
                              )}

                              {/* DELETE */}

                              <button
                                onClick={async (e) => {

                                  e.stopPropagation();

                                  if (!window.confirm("Delete this refill order?"))
                                    return;

                                  try {

                                    setLoadingAction(order._id);

                                    await orderService.deleteOrder(order._id);

                                    fetchOrders();

                                  } finally {

                                    setLoadingAction(null);

                                  }

                                }}
                                disabled={loadingAction === order._id}
                                className="p-2 rounded-xl hover:bg-red-100 text-red-600 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }))}
                </tbody>
              </table>


            </div>
            <div className="flex items-center justify-between mt-6 px-4">

              <p className="text-sm text-on-surface-variant">
                Showing{" "} Page
                {' ' + (currentPage - 1) * ORDERS_PER_PAGE + 1}
                {" - "}
                {Math.min(
                  currentPage * ORDERS_PER_PAGE,
                  refillOrders.length
                )}{" "}
                of {refillOrders.length} orders
              </p>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-surface-container disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="font-medium">
                  {currentPage} / {totalPages || 1}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-surface-container disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>


          {/* Logistics Insights 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] bg-surface-container-low border border-outline-variant/10">
              <h4 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  local_shipping
                </span>

                Collection Hub Activity
              </h4>

              <p className="text-body-lg text-on-surface-variant mb-8">
                Current refill volume by collection location.
              </p>

              {/*{logisticsData.length === 0 ? (
                <div className="py-10 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl mb-3">
                    warehouse
                  </span>

                  <p>No refill logistics available yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {logisticsData.map((hub) => (
                    <div key={hub.name}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-bold">
                            {hub.name}
                          </p>

                          <p className="text-xs text-on-surface-variant">
                            {hub.orders} orders •{" "}
                            {hub.volume.toFixed(1)} L
                          </p>
                        </div>

                        <span
                          className={`font-bold ${hub.percentage >= 90
                            ? "text-error"
                            : hub.percentage >= 70
                              ? "text-secondary"
                              : "text-primary"
                            }`}
                        >
                          {hub.percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${hub.percentage >= 90
                            ? "bg-error"
                            : hub.percentage >= 70
                              ? "bg-secondary"
                              : "bg-primary"
                            }`}
                          style={{
                            width: `${hub.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>*/}

          {/* Image Card 
            <div className="relative rounded-[2rem] overflow-hidden group h-full min-h-[400px]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXyYl1UWW3EkgrNPOaOEn0ZRAS1W2wQMzB2gvaPER8sCHFDcChKHwYNH-Un3yFow3ahU4na_UgjinxUNc5aJLrjaz6J8LotdcDV4NrqIqjVF1Tm8WOr6emXRi07TmePtEps0QAc5kuAfKS29NnCT5HJmlwSzuY1YsvayDihEgFjXymA7R5HHIYQP3EerieGP-glTy5HCcHHQ3_Px7cCXeu4pkEvmlYPx8SyPJarhIxsWJzi-9x_NktilNaF_g-m6mvJPp8yE4XCQBN"
                alt="Eco refill station"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 z-10">
                <h4 className="text-3xl font-bold text-white mb-2">
                  Circular Economy Impact
                </h4>

                <p className="text-body-lg text-white/80">
                  Refill customers have saved approximately{" "}
                  <span className="font-bold">
                    {bottlesSaved.toLocaleString()}
                  </span>{" "}
                  plastic bottles through reusable products.
                </p>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="mt-4 px-6 py-2 bg-white text-primary font-bold rounded-full hover:bg-primary-fixed transition-colors"
                >
                  View Refill Analytics
                </button>
              </div>
            </div>
          </div>*/}
        </div>
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-surface rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* HEADER */}
              <div className="flex justify-between items-start p-8 border-b border-outline-variant">

                <div>
                  <p className="text-label-md text-on-surface-variant uppercase">
                    Order
                  </p>

                  <h2 className="text-headline-sm font-bold text-on-surface">
                    #
                    {selectedOrder._id
                      .slice(-6)
                      .toUpperCase()}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>

              </div>

              <div className="p-8 space-y-8">
                {/* CUSTOMER */}
                <section>
                  <h3 className="text-title-md font-bold mb-4">
                    Customer
                  </h3>

                  <div className="bg-surface-container-low rounded-2xl p-5 space-y-2">

                    <p className="font-bold">
                      {selectedOrder.userInfo.name}
                    </p>

                    <p className="text-on-surface-variant">
                      {selectedOrder.userInfo.email}
                    </p>

                    <p className="text-on-surface-variant">
                      {selectedOrder.userInfo.number}
                    </p>

                    <p className="text-on-surface-variant">
                      {selectedOrder.userInfo.location}
                    </p>

                  </div>
                </section>

                {/* ITEMS */}
                <section>

                  <h3 className="text-title-md font-bold mb-4">
                    Items
                  </h3>
                  <div className="space-y-3">

                    {selectedOrder.items.map((item) => {

                      const article =
                        orderArticles[item.article];
                      return (
                        <div
                          key={item._id}
                          className="flex gap-4 bg-surface-container-low rounded-2xl p-4"
                        >
                          {/* IMAGE */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container">
                            {article?.photo ? (
                              <img
                                src={`${API_URL}${article.photo}`}
                                alt={article.nom}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined">
                                  image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* INFO */}
                          <div className="flex-1">

                            <p className="font-bold">
                              {article?.nom ?? "Loading..."}
                            </p>

                            <p className="text-sm text-on-surface-variant">
                              Quantity: {item.quantity}
                            </p>

                            <p className="text-sm text-on-surface-variant">
                              Price: {item.price.toFixed(2)} TND
                            </p>

                            <p className="text-sm text-primary font-bold">
                              {item.points} points
                            </p>

                          </div>
                          <div className="font-bold">
                            {(item.price * item.quantity)
                              .toFixed(2)}
                            TND
                          </div>

                        </div>
                      );
                    })}

                  </div>
                </section>

                {/* DELIVERY */}

                <section>
                  <h3 className="text-title-md font-bold mb-4">
                    Delivery
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard
                      icon="calendar_month"
                      label="Date"
                      value={
                        new Date(
                          selectedOrder.deliveryDate
                        ).toLocaleDateString()
                      }
                    />
                    <InfoCard
                      icon="local_shipping"
                      label="Option"
                      value={selectedOrder.deliveryOption}
                    />
                    <InfoCard
                      icon="payments"
                      label="Delivery fee"
                      value={`${selectedOrder.deliveryFee} TND`}
                    />
                    <InfoCard
                      icon="location_on"
                      label="Address"
                      value={selectedOrder.userInfo.location}
                    />
                  </div>
                </section>
                {/* PAYMENT SUMMARY */}
                <section>
                  <h3 className="text-title-md font-bold mb-4">
                    Payment
                  </h3>
                  <div className="bg-primary-container/20 rounded-2xl p-5 space-y-3">
                    <Row
                      label="Payment method"
                      value={selectedOrder.paymentMethod}
                    />
                    <Row
                      label="Paid with points"
                      value={
                        selectedOrder.paidWithPoints
                          ? "Yes"
                          : "No"
                      }
                    />
                    <Row
                      label="Points used"
                      value={`${selectedOrder.pointsUsed} pts`}
                    />
                    <Row
                      label="Total"
                      value={`${selectedOrder.totalPrice.toFixed(2)} TND`}
                      bold
                    />
                  </div>
                </section>
                {/* ENVIRONMENT */}
                <section>
                  <h3 className="text-title-md font-bold mb-4">
                    Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard
                      icon="stars"
                      label="Points earned"
                      value={`${selectedOrder.totalPoints}`}
                    />
                    <InfoCard
                      icon="eco"
                      label="CO₂ saved"
                      value={`${selectedOrder.totalCO2}`}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}