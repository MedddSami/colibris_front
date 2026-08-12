'use client'

import { orderService } from "@/services/orderService";
import { Order } from "@/types/api";
import { useEffect, useMemo, useState } from "react";

const statusConfig = {
  pending: {
    label: "Pending",
    progress: 35,
    badge: "bg-yellow-100 text-yellow-700",
    bar: "bg-yellow-500",
    icon: "schedule",
    message: "Your order is waiting for confirmation.",
  },

  confirmed: {
    label: "Confirmed",
    progress: 100,
    badge: "bg-green-100 text-green-700",
    bar: "bg-green-500",
    icon: "check_circle",
    message: "Your order has been confirmed.",
  },

  cancelled: {
    label: "Cancelled",
    progress: 100,
    badge: "bg-red-100 text-red-700",
    bar: "bg-red-500",
    icon: "cancel",
    message: "This order has been cancelled.",
  },
} as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopOrders, setShopOrders] = useState<Order[]>([]);
  const [refillOrders, setRefillOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "shop" | "refill"
  >("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const ORDERS_PER_PAGE = 4;

  const [currentPage, setCurrentPage] = useState(1);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const [shopOrders, refillOrders] = await Promise.all([
          orderService.getUserShopOrders(),
          orderService.getUserRefillOrders(),
        ]);

        setShopOrders(shopOrders);
        setRefillOrders(refillOrders);

        const mergedOrders = [...shopOrders, ...refillOrders].sort(
          (a, b) =>
            new Date(b.deliveryDate).getTime() -
            new Date(a.deliveryDate).getTime()
        );

        console.log(mergedOrders, "orders")

        setOrders(mergedOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sustainability = useMemo(() => {

    const totalCO2 = orders.reduce(
      (sum, order) => sum + (order.totalCO2 || 0),
      0
    );


    // Example conversion:
    // 1 plastic bottle ≈ 0.08 kg CO2 footprint
    const bottlesSaved = Math.round(
      totalCO2 / 0.08
    );


    const totalPoints = orders.reduce(
      (sum, order) => sum + (order.totalPoints || 0),
      0
    );


    const milestone = 150;

    const milestoneProgress = Math.min(
      (bottlesSaved / milestone) * 100,
      100
    );


    return {
      totalCO2,
      bottlesSaved,
      totalPoints,
      milestoneProgress
    };

  }, [orders]);


  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchQuery]);

  const displayedOrders = orders.filter((order) => {
    // Filter by type
    const matchesType =
      selectedType === "all" || order.type === selectedType;

    // Search
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      order._id.toLowerCase().includes(query) ||
      order.userInfo?.name?.toLowerCase().includes(query) ||
      order.items.some((item) =>
        item.article.nom.toLowerCase().includes(query)
      );

    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(
    displayedOrders.length / ORDERS_PER_PAGE
  );

  const paginatedOrders = displayedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const generateLastMonths = (orders: Order[]) => {
    const months = [];

    const now = new Date();


    for (let i = 5; i >= 0; i--) {

      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );


      months.push({
        month: date.toLocaleString("default", {
          month: "short",
        }),

        year: date.getFullYear(),

        value: 0,
      });
    }


    orders.forEach((order) => {

      if (!order.createdAt) return;


      const date = new Date(order.createdAt);


      const month = date.toLocaleString("default", {
        month: "short",
      });


      const target = months.find(
        (m) =>
          m.month === month &&
          m.year === date.getFullYear()
      );


      if (target) {

        target.value += Number(order.totalCO2 || 0);

      }

    });


    console.log("CO2 chart data:", months);


    return months;
  };


  const impactChart = generateLastMonths(displayedOrders);

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  } as const;


  const orderCounts = {
    all: orders.length,
    shop: orders.filter((o) => o.type === "shop").length,
    refill: orders.filter((o) => o.type === "refill").length,
  };

  const filters = [
    {
      key: "all",
      label: `All (${orderCounts.all})`,
    },
    {
      key: "shop",
      label: `Shop (${orderCounts.shop})`,
    },
    {
      key: "refill",
      label: `Refills (${orderCounts.refill})`,
    },
  ];

  const statusConfig = {
    pending: {
      label: "Pending",
      progress: 35,
      badge: "bg-yellow-100 text-yellow-700",
      bar: "bg-yellow-500",
      icon: "schedule",
      message: "Your order is waiting for confirmation.",
    },

    confirmed: {
      label: "Confirmed",
      progress: 100,
      badge: "bg-green-100 text-green-700",
      bar: "bg-green-500",
      icon: "check_circle",
      message: "Your order has been confirmed.",
    },

    cancelled: {
      label: "Cancelled",
      progress: 100,
      badge: "bg-red-100 text-red-700",
      bar: "bg-red-500",
      icon: "cancel",
      message: "This order has been cancelled.",
    },
  } as const;

  const latestShopOrder = [...shopOrders]
    .sort(
      (a, b) =>
        new Date(b.deliveryDate).getTime() -
        new Date(a.deliveryDate).getTime()
    )[0];

  const latestRefillOrder = [...refillOrders]
    .sort(
      (a, b) =>
        new Date(b.deliveryDate).getTime() -
        new Date(a.deliveryDate).getTime()
    )[0];

  const getNextMilestone = (saved: number) => {

    const step = 50;

    const next =
      Math.ceil((saved + 1) / step) * step;


    return next;
  };

  const nextMilestone = getNextMilestone(
    sustainability.bottlesSaved
  );


  const progress =
    Math.min(
      (sustainability.bottlesSaved / nextMilestone) * 100,
      100
    );

  return (
    <main className="pt-4 pb-6 px-4 min-h-screen">
      <div className="max-w-12xl mx-auto space-y-4">

        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-display-lg font-bold tracking-tight text-on-background leading-tight">
              My Orders
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Track your conscious consumption. Every refill and purchase contributes to a circular future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-body-lg"
              />
            </div>

            <div className="flex bg-surface-container-low p-1 rounded-xl w-full sm:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedType(filter.key)}
                  className={`px-6 py-2 rounded-lg transition-all font-medium ${selectedType === filter.key
                    ? "bg-surface-container-lowest shadow-sm text-primary font-bold"
                    : "text-on-surface-variant hover:text-primary"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Active Orders */}
        <section className="space-y-6">

          <h2 className="text-headline-md font-medium text-primary flex items-center gap-2">

            <span className="material-symbols-outlined">
              pending_actions
            </span>

            Recent Orders

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <OrderProgressCard
              order={latestShopOrder}
              type="shop"
            />

            <OrderProgressCard
              order={latestRefillOrder}
              type="refill"
            />

          </div>

        </section>


        {/* Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Order History */}
          <section className="lg:col-span-3 space-y-6">
            <h2 className="text-headline-md font-medium text-on-surface">
              Order History
            </h2>

            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">

                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-widest">
                        Order
                      </th>

                      <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-widest">
                        Type
                      </th>

                      <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-widest">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-widest">
                        Status
                      </th>

                      <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-outline-variant/10">

                    {loading ? (

                      <tr>
                        <td colSpan={5} className="py-20">
                          <div className="flex flex-col items-center gap-5">

                            <img
                              src="/logo_horizontal_+_tagline_noir_rvb.png"
                              alt="Colibris"
                              className="h-32 w-32 animate-pulse object-contain opacity/90"
                            />

                            <div className="text-center">

                              <p className="font-semibold text-on-surface">
                                Loading your orders...
                              </p>

                              <p className="text-sm text-on-surface-variant">
                                Please wait a moment.
                              </p>

                            </div>

                          </div>
                        </td>
                      </tr>


                    ) : paginatedOrders.length === 0 ? (

                      <tr>
                        <td colSpan={5} className="py-16 text-center">

                          <div className="flex flex-col items-center gap-3">

                            <span className="material-symbols-outlined text-5xl text-outline">
                              receipt_long
                            </span>

                            <h3 className="font-semibold">
                              No orders yet
                            </h3>

                            <p className="text-on-surface-variant">
                              Your purchases and refill orders will appear here.
                            </p>

                          </div>

                        </td>
                      </tr>

                    ) : (

                      paginatedOrders.map((order) => {
                        const firstItem = order.items[0];

                        const paymentClasses = {
                          money: "bg-blue-100 text-blue-700",
                          points: "bg-amber-100 text-amber-700",
                          hybrid: "bg-violet-100 text-violet-700",
                        };

                        return (
                          <tr
                            key={order._id}
                            className="hover:bg-surface-container-low transition-colors"
                          >
                            {/* ORDER */}

                            <td className="px-6 py-5">
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item._id}>
                                    <p className="font-semibold text-body-md">
                                      {item.article.nom}
                                    </p>

                                    <p className="text-xs text-on-surface-variant">
                                      {item.quantity} × {item.volume ?? "Unit"}
                                    </p>
                                  </div>
                                ))}

                                <div className="pt-2 border-t border-outline-variant/20">
                                  <p className="text-label-md text-on-surface-variant">
                                    #{order._id.slice(-6).toUpperCase()}
                                  </p>

                                  <p className="text-xs text-on-surface-variant">
                                    Ordered {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </td>


                            {/* TYPE */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${order.type === "shop"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-emerald-100 text-emerald-700"
                                  }`}
                              >
                                {order.type}
                              </span>

                            </td>

                            {/* PAYMENT */}

                            <td className="px-6 py-5">

                              <div className="space-y-1">

                                <p className="font-bold">
                                  {order.totalPrice.toFixed(2)} DT
                                </p>

                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${paymentClasses[order.paymentMethod]
                                    }`}
                                >
                                  {order.paymentMethod}
                                </span>

                                {order.pointsUsed > 0 && (
                                  <p className="text-xs text-emerald-600">
                                    Used {order.pointsUsed} pts
                                  </p>
                                )}

                                <p className="text-xs text-on-surface-variant">
                                  Delivery:{" "}
                                  {order.deliveryFee === 0
                                    ? "Free"
                                    : `${order.deliveryFee} DT`}
                                </p>

                              </div>

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <div className="space-y-2">

                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status]
                                    }`}
                                >
                                  {order.status}
                                </span>

                                <p className="text-xs text-on-surface-variant">
                                  🚚 {new Date(order.deliveryDate).toLocaleDateString()}
                                </p>

                              </div>

                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-5">

                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="font-semibold text-primary hover:underline"
                              >
                                View Details
                              </button>

                            </td>

                          </tr>
                        );
                      })

                    )}

                  </tbody>

                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low/30 px-6 py-4">

                  <p className="text-sm text-on-surface-variant">
                    Showing{" "}
                    {(currentPage - 1) * ORDERS_PER_PAGE + 1}
                    {" – "}
                    {Math.min(
                      currentPage * ORDERS_PER_PAGE,
                      displayedOrders.length
                    )}
                    {" of "}
                    {displayedOrders.length} orders
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => page - 1)
                      }
                      className="rounded-lg border border-outline-variant px-3 py-2 disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-10 w-10 rounded-lg font-medium transition ${currentPage === page
                            ? "bg-primary text-white"
                            : "hover:bg-surface-container"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) => page + 1)
                      }
                      className="rounded-lg border border-outline-variant px-3 py-2 disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>

                  </div>

                </div>
              )}

            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-8">

            <h2 className="text-headline-md font-medium text-on-surface">
              Sustainability
            </h2>

            <div className="glass-card rounded-3xl p-8 border border-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

              <div className="relative space-y-6">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <span className="font-bold text-title-lg text-primary">
                    Your Impact
                  </span>
                </div>

                <div className="flex items-end gap-4">
                  <div className="text-display-lg font-extrabold text-primary">
                    <div className="text-display-lg font-extrabold text-primary">
                      {sustainability.bottlesSaved}
                    </div>
                  </div>
                  <div className="text-label-md uppercase font-bold text-on-surface-variant">
                    Plastic Bottles Saved
                  </div>
                </div>

                <p className="text-body-lg text-on-surface-variant">
                  You have prevented{" "}
                  <strong>
                    {sustainability.totalCO2.toFixed(1)} kg
                  </strong>{" "}
                  of CO₂ emissions through your sustainable orders.
                </p>


                <div className="h-40 w-full flex items-end gap-3 px-2">

                  {impactChart.map((item) => {

                    const maxValue = Math.max(
                      ...impactChart.map((i) => i.value),
                      1
                    );


                    const barHeight =
                      item.value > 0
                        ? (item.value / maxValue) * 100
                        : 5;


                    return (

                      <div
                        key={`${item.month}-${item.year}`}
                        className="flex-1 flex flex-col items-center justify-end h-full gap-2"
                      >

                        {/* BAR AREA */}
                        <div className="relative flex-1 w-full flex items-end justify-center">

                          {/* VALUE */}
                          {item.value > 0 && (
                            <span
                              className="
                                absolute
                                text-[10px]
                                font-bold
                                text-primary
                                -top-5
                              "
                            >
                              {item.value} kg
                            </span>
                          )}


                          {/* BAR */}
                          <div
                            className="
                              w-full
                              bg-primary/30
                              rounded-t-lg
                              hover:bg-primary/50
                              transition-all
                            "
                            style={{
                              height: `${barHeight}%`,
                              minHeight: item.value > 0 ? "12px" : "4px",
                            }}
                          />

                        </div>

                        {/* MONTH */}
                        <span className="text-[10px] text-on-surface-variant">
                          {item.month}
                        </span>

                      </div>
                    );
                  })}
                </div>


              </div>
            </div>

            <div className="bg-surface-container-high rounded-3xl p-6 space-y-4 border border-outline-variant/5">
              <div className="w-full h-40 rounded-2xl overflow-hidden relative">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrSY47zGrmD1_MXTaHsQzho1IgDsgrmyw0FAWPWVCin4C3_LWAsHSJS5egK8wGHfwnGbB6_uH1fbOS9pqj8rEqRa7mxzZd9yJ9y8z-c9Ry5wAJdrSU80gCC3UPZh9JBTqM6Cp9DM-pNXvSdjHOVOdjHC3z3Iv0daO9r0anY9Ti4bzPFJrt7IdNkMc1nUJ6k-CvAvBhtofzeWOhKVKKv40wHUjqN4aXMG4BBLVxC3B4GVJow4lPKZvO3oIBWjYAr-W3HFPLqURsr6Z4"
                  alt="forest"
                />

                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

                <div className="absolute bottom-4 left-4 right-4">

                  <p className="text-on-primary font-bold text-label-md">
                    Next Milestone: {nextMilestone} bottles
                  </p>

                  <div className="w-full h-1 bg-on-primary/30 rounded-full mt-2">

                    <div
                      className="h-full bg-on-primary rounded-full transition-all"
                      style={{
                        width: `${progress}%`
                      }}
                    />

                  </div>


                  <div
                    className="h-full bg-on-primary rounded-full transition-all"
                    style={{
                      width: `${sustainability.milestoneProgress}%`
                    }}
                  />
                </div>
              </div>

              <p className="text-label-md text-on-surface-variant">
                {
                  sustainability.bottlesSaved >= 150
                    ? "Congratulations! You reached your tree planting milestone."
                    : `Keep going! ${Math.ceil(
                      150 - sustainability.bottlesSaved
                    )} bottles away from your next milestone.`
                }
              </p>
            </div>

          </aside>

        </div>

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
                  #{selectedOrder._id?.slice(-6).toUpperCase()}
                </h2>

                <p className="text-sm text-primary font-semibold mt-2 capitalize">
                  {selectedOrder.status}
                </p>
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


              {/* ORDER INFO */}
              <section>
                <h3 className="text-title-md font-bold mb-4">
                  Order Information
                </h3>

                <div className="grid grid-cols-2 gap-4">

                  <InfoCard
                    icon="calendar_month"
                    label="Created"
                    value={
                      new Date(
                        selectedOrder.createdAt
                      ).toLocaleDateString()
                    }
                  />

                  <InfoCard
                    icon="category"
                    label="Type"
                    value={selectedOrder.type}
                  />

                  <InfoCard
                    icon="fingerprint"
                    label="Group"
                    value={selectedOrder.orderGroup.slice(-6)}
                  />

                  <InfoCard
                    icon="update"
                    label="Updated"
                    value={
                      new Date(
                        selectedOrder.updatedAt
                      ).toLocaleDateString()
                    }
                  />

                </div>
              </section>



              {/* ITEMS */}
              <section>

                <h3 className="text-title-md font-bold mb-4">
                  Items
                </h3>


                <div className="space-y-3">

                  {selectedOrder.items.map((item) => {

                    const article = item.article;

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
                            {article?.nom ?? "Unknown product"}
                          </p>


                          <p className="text-sm text-on-surface-variant">
                            Quantity: {item.quantity}
                          </p>


                          <p className="text-sm text-on-surface-variant">
                            Unit price: {item.price.toFixed(2)} TND
                          </p>


                          <p className="text-sm text-primary font-bold">
                            {item.points} points/item
                          </p>

                        </div>



                        <div className="font-bold">
                          {(item.price * item.quantity).toFixed(2)} TND
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
                    label="Delivery date"
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

                </div>

              </section>




              {/* PAYMENT */}
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




              {/* IMPACT */}
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
                    value={`${selectedOrder.totalCO2} kg`}
                  />

                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const OrderProgressCard = ({
  order,
  type,
}: {
  order?: Order;
  type: "shop" | "refill";
}) => {
  if (!order) {
    return (
      <div className="glass-card rounded-2xl border border-outline-variant/10 p-8 flex items-center justify-center">
        <div className="text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3">
            inventory
          </span>

          <p>No {type} orders yet.</p>
        </div>
      </div>
    );
  }

  const firstItem = order.items[0];

  const status =
    statusConfig[order.status as keyof typeof statusConfig];

  return (
    <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">

      <div
        className={`absolute -right-12 -top-12 w-48 h-48 blur-3xl rounded-full
        ${type === "shop"
            ? "bg-primary/5"
            : "bg-secondary/5"
          }`}
      />

      <div className="flex justify-between items-start mb-6">

        <div className="flex items-center gap-4">

          <div
            className={`w-14 h-14 rounded-xl overflow-hidden
            ${type === "shop"
                ? "bg-primary-container/20"
                : "bg-secondary-container/20"
              }`}
          >
            <img
              src={
                type === "shop"
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAikwWvyyEXRoVpz4AypfAg7YrFOeKPM7-ys5oF9o63X8mDsPkwROHZu0NAc47mB9JSuB6x1Tu0wsYYvII4WSkZkyhOoC0h-KVzB_H0GrIkHoCDhNfUefyeWyDpIUVlxXrRj9Y84W9Hggc3EqggVvbUA_OjawESXOQ_xEyHWuhZ5cKsurFQqifMCDphdVCCB1YzGc4afT1IOtYXQW_kslFHFIpL3rKMFzeayBRoDUm4KqY-f2hbuhgpk-Qo18TGnVISSN-ARYvpNAWh"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuDT5DhmKPT_KIM_-CTwvJJNZbU4nEgt3lhLSgtq6KLRFTUBi9GOJwPWgcpx6_3gKfEL77Xl6O1l1sLClVGqmB8ZZW_Vsccg3IGhOCmYJAkF-luw5JkMG-ndwhjSodCgm4ArBlP3q9dDuoRYuH7qIJtFBu3uUdY9QBzX22zMDIMdJn--fRuoKG6ppRUMeKP3NlT2l4iR0q5xAFWs_JM11K9AWKyMHzTIpGIqd7IaY_4Co3VCZkm5s77LkKdpd_I20m5ERRi28zYp60OH"
              }
              className="w-full h-full object-cover"
              alt={firstItem.article.nom}
            />
          </div>

          <div>

            <span
              className={`text-label-md font-bold uppercase tracking-widest opacity-60
              ${type === "shop"
                  ? "text-primary"
                  : "text-secondary"
                }`}
            >
              {type === "shop"
                ? "Shop Order"
                : "Refill"}

              {" #"}

              {order._id.slice(-6).toUpperCase()}
            </span>

            <h3 className="text-title-lg font-bold">

              {firstItem.article.nom}

              {order.items.length > 1 &&
                ` +${order.items.length - 1} more`}

            </h3>

          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full font-bold text-label-md ${status.badge}`}
        >
          {order.status}
        </span>

      </div>

      <div className="space-y-2">

        <div className="flex justify-between text-label-md">

          <span>Status</span>

          <span>{status.progress}%</span>

        </div>

        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">

          <div
            className={status.bar}
            style={{
              width: `${status.progress}%`,
            }}
          />

        </div>

        <p className="pt-2 flex items-center gap-2 text-label-md text-on-surface-variant">

          <span className="material-symbols-outlined text-[16px]">
            {status.icon}
          </span>

          {status.message}

        </p>

      </div>
    </div>
  );
};


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
