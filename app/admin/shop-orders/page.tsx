"use client"

import { orderService } from "@/services/orderService";
import { shopService } from "@/services/shopService";
import { Article, Order } from "@/types/api";
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


export default function ShopOrdersDashboard() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [timeframe, setTimeframe] = useState<string>("30d");

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderArticles, setOrderArticles] = useState<Record<string, Article>>({});
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 4;

    const statusOptions = ["all", "pending", "confirmed", "cancelled"];


    const fetchOrders = async () => {
        try {
            setLoading(true);

            const data = await orderService.getAdminShopOrders();

            setOrders(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const isWithinTimeframe = (order: Order) => {
        const date = new Date(order.deliveryDate);
        const now = new Date();

        const diffDays =
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

        if (timeframe === "30d") return diffDays <= 30;
        if (timeframe === "quarter") return diffDays <= 90;
        if (timeframe === "year") return diffDays <= 365;

        return true;
    };

    const filteredOrders = orders.filter((order) => {
        const statusMatch =
            statusFilter === "all" || order.status === statusFilter;

        const timeMatch = isWithinTimeframe(order);

        return statusMatch && timeMatch;
    });

    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(o => o.status === "pending").length;

    const confirmedOrders = orders.filter(o => o.status === "confirmed").length;

    const now = new Date();

    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - 14);

    const thisWeekOrders = orders.filter((o) => {
        const date = new Date(o.deliveryDate);

        return (
            !isNaN(date) &&
            date >= startOfThisWeek &&
            date <= now
        );
    }).length;

    const lastWeekOrders = orders.filter((o) => {
        const date = new Date(o.deliveryDate);

        return (
            !isNaN(date) &&
            date >= startOfLastWeek &&
            date < startOfThisWeek
        );
    }).length;

    const weeklyGrowth =
        lastWeekOrders === 0
            ? thisWeekOrders > 0
                ? 100
                : 0
            : ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100;


    const exportCSV = () => {
        const headers = [
            "Order ID",
            "Customer",
            "Email",
            "Status",
            "Total Price",
            "Points",
            "Date",
        ];

        const rows = orders.map((order) => [
            order._id,
            order.userInfo.name,
            order.userInfo.email,
            order.status,
            order.totalPrice,
            order.totalPoints,
            new Date(order.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((r) => r.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "shop-orders.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openOrderDetails = async (order: Order) => {
        setSelectedOrder(order);
        setLoadingDetails(true);

        try {
            const articles: Record<string, Article> = {};

            await Promise.all(
                order.items.map(async (item) => {
                    console.log(item.article, "ids");
                    const article = await shopService.getArticleById(
                        item.article._id
                    );

                    console.log(article, "items");

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
        <div className="bg-background text-on-background selection:bg-primary/20">
            {/* Main Content */}
            <main className="min-h-screen">
                {/* Page Header & Stats */}
                <div className="px-10 pt-10 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-[3.5rem] leading-none font-bold -tracking-[0.03em] text-on-surface mb-2">Shop Orders</h2>
                            <p className="text-body-lg text-on-surface-variant max-w-lg">Manage ecosystem transactions, track eco-friendly shipping logistics, and monitor customer impact across the global shop.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(20,29,32,0.06)] min-w-[180px]">
                                <p className="text-label-md text-on-surface-variant font-medium uppercase tracking-widest mb-1">Weekly Growth</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-headline-md font-bold text-primary">
                                        {weeklyGrowth >= 0 ? "+" : ""}
                                        {weeklyGrowth.toFixed(1)}%
                                    </span>

                                    <span className="material-symbols-outlined text-primary text-sm">
                                        trending_up
                                    </span>
                                </div>
                            </div>
                            <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,108,74,0.15)] min-w-[180px]">
                                <p className="text-label-md text-on-primary opacity-80 font-medium uppercase tracking-widest mb-1">Total Revenue</p>
                                <span className="text-headline-md font-bold">
                                    {totalRevenue.toLocaleString()} TND
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Filters Section (Editorial Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                        <div className="md:col-span-8 bg-surface-container-low p-8 rounded-3xl flex flex-wrap items-center gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-tighter">Filter by Status</span>
                                <div className="flex gap-2">
                                    {statusOptions.map((status) => {
                                        const isActive = statusFilter === status;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setCurrentPage(1);
                                                }}
                                                className={`px-5 py-2 rounded-full text-label-md font-bold transition-all capitalize
                                                    ${isActive
                                                        ? "bg-primary-container text-on-primary-container"
                                                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-white"
                                                    }`}
                                            >
                                                {status === "all" ? "All Orders" : status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-px h-12 bg-outline-variant/30 hidden lg:block"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-tighter">Timeframe</span>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant" data-icon="calendar_today">calendar_today</span>
                                    <select className="bg-surface-container-lowest border-none rounded-xl pl-10 pr-10 py-2 text-label-md font-bold text-on-surface-variant appearance-none ring-1 ring-outline-variant/20">
                                        <option>Last 30 Days</option>
                                        <option>This Quarter</option>
                                        <option>This Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-4 bg-secondary text-on-secondary p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <h4 className="text-title-lg font-bold mb-1">Export Data</h4>
                                <p className="text-body-lg opacity-80 mb-4">Download comprehensive CSV for logistics.</p>
                                <button
                                    onClick={exportCSV}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-full transition-all self-start"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    <span className="font-bold">Generate CSV</span>
                                </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <span className="material-symbols-outlined text-[120px]" data-icon="description">description</span>
                            </div>
                        </div>
                    </div>
                    {/* Orders Table Container */}
                    <div className="bg-surface-container-lowest rounded-3xl shadow-[0px_32px_64px_-12px_rgba(20,29,32,0.08)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        {[
                                            "Order",
                                            "Customer",
                                            "Products",
                                            "Payment",
                                            "Delivery",
                                            //"Rewards",
                                            "Status",
                                            "Actions",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-5 text-left text-label-md font-bold text-on-surface-variant uppercase tracking-wider"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-outline-variant/10">
                                    {paginatedOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-5xl opacity-40">
                                                        inventory_2
                                                    </span>

                                                    <p className="text-lg font-semibold">
                                                        No shop orders yet
                                                    </p>

                                                    <p>
                                                        Orders will appear here once customers purchase products.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedOrders.map((order) => {
                                            const initials = order.userInfo?.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase();

                                            const statusClasses = {
                                                pending: "bg-yellow-100 text-yellow-700",
                                                confirmed: "bg-blue-100 text-blue-700",
                                                preparing: "bg-purple-100 text-purple-700",
                                                delivered: "bg-green-100 text-green-700",
                                                cancelled: "bg-red-100 text-red-700",
                                            };

                                            return (
                                                <tr
                                                    key={order._id}
                                                    onClick={() => openOrderDetails(order)}
                                                    className="hover:bg-surface-container-low/30 transition-colors cursor-pointer"
                                                >
                                                    {/* ORDER */}
                                                    <td className="px-6 py-6">
                                                        <p className="font-bold text-primary">
                                                            #{order._id.slice(-6).toUpperCase()}
                                                        </p>

                                                        <p className="text-sm text-on-surface-variant">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>

                                                        <p className="text-xs capitalize text-on-surface-variant">
                                                            {order.type}
                                                        </p>
                                                    </td>

                                                    {/* CUSTOMER */}
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold">
                                                                {initials}
                                                            </div>

                                                            <div>
                                                                <p className="font-semibold">
                                                                    {order.userInfo.name}
                                                                </p>

                                                                <p className="text-sm text-on-surface-variant">
                                                                    {order.userInfo.email}
                                                                </p>

                                                                <p className="text-xs text-on-surface-variant">
                                                                    📞 {order.userInfo.number}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* PRODUCTS */}
                                                    <td className="px-6 py-6">
                                                        <div className="space-y-2">
                                                            {order.items.map((item) => (
                                                                <div key={item._id}>
                                                                    <p className="font-medium">
                                                                        {item.article.nom}
                                                                    </p>

                                                                    <p className="text-sm text-on-surface-variant">
                                                                        Qty: {item.quantity}
                                                                        {item.volume && ` • ${item.volume}`}
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
                                                            {order.paymentMethod}
                                                        </p>

                                                        {order.pointsUsed > 0 && (
                                                            <p className="text-sm font-medium text-green-600">
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
                                                            {new Date(
                                                                order.deliveryDate
                                                            ).toLocaleDateString()}
                                                        </p>

                                                        <p className="text-sm capitalize text-on-surface-variant">
                                                            {order.deliveryOption}
                                                        </p>

                                                        <p
                                                            title={order.userInfo.location}
                                                            className="text-xs text-on-surface-variant max-w-[220px] truncate"
                                                        >
                                                            📍 {order.userInfo.location}
                                                        </p>
                                                    </td>

                                                    {/* REWARDS 
                                                    <td className="px-6 py-6">
                                                        <p className="text-green-600 font-medium">
                                                            🌱 {order.totalCO2} CO₂
                                                        </p>

                                                        <p className="text-amber-600 font-medium">
                                                            ⭐ {order.totalPoints} pts
                                                        </p>
                                                    </td>*/}

                                                    {/* STATUS */}
                                                    <td className="px-6 py-6">
                                                        <span
                                                            className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold ${statusClasses[order.status] ??
                                                                "bg-gray-100 text-gray-700"
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="px-6 py-6">
                                                        <div className="flex justify-end gap-2">
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

                                                            {order.status === "pending" && (
                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();

                                                                        try {
                                                                            setLoadingAction(order._id);

                                                                            await orderService.confirmOrder(
                                                                                order._id
                                                                            );

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

                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();

                                                                    if (
                                                                        !window.confirm(
                                                                            "Delete this order?"
                                                                        )
                                                                    )
                                                                        return;

                                                                    try {
                                                                        setLoadingAction(order._id);

                                                                        await orderService.deleteOrder(
                                                                            order._id
                                                                        );

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
                                        })
                                    )}
                                </tbody>
                            </table>

                        </div>
                        <div className="px-8 py-6 bg-surface-container-low/20 flex items-center justify-between border-t border-outline-variant/10">
                            <p className="text-label-md text-on-surface-variant">
                                Showing{" "}
                                <span className="font-bold text-on-surface">
                                    {paginatedOrders.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-on-surface">
                                    {orders.length}
                                </span>{" "}
                                orders
                            </p>

                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-lowest disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_left
                                    </span>
                                </button>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl ${currentPage === i + 1
                                            ? "bg-primary text-on-primary"
                                            : "bg-surface-container-lowest"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-lowest disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        </div>
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