"use client"

import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { Reservation, User } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link'
import { NextBookedCollectionResponse } from "@/types/user";
import { ManageReservationModal } from "@/components/modals/User/ManageReservationModal";

export default function ReservationsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation>();
    const [user, setUser] = useState<User>();
    const [nextCollection, setNextCollection] =
        useState<NextBookedCollectionResponse | null>(null);
    const [managingHistory, setManagingHistory] = useState<Reservation | null>(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 4;


    const fetchReservations = async () => {
        try {
            setLoading(true);

            const data = await userService.getHistory();
            const user = await authService.getProfile();
            const nextBookedCollection = await userService.getNextBookedCollection();

            setReservations(data);
            setUser(user);
            setNextCollection(nextBookedCollection);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
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

    const filteredReservations = useMemo(() => {
        return reservations.filter((history) => {
            const reservation = history.reservation;

            const statusMatch =
                statusFilter === "all" ||
                reservation.status === statusFilter;

            const paymentMatch =
                paymentFilter === "all" ||
                (paymentFilter === "paid"
                    ? reservation.isPaid
                    : !reservation.isPaid);

            return statusMatch && paymentMatch;
        });
    }, [reservations, statusFilter, paymentFilter]);

    const totalPages = Math.ceil(
        filteredReservations.length / ITEMS_PER_PAGE
    );

    const paginatedReservations = filteredReservations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const totalCollections = reservations.length;

    const completedCollections = reservations.filter(
        (r) => r.reservation.status === "confirmed"
    ).length;

    // Assuming 3kg CO2 saved per completed pickup
    const co2Saved = (completedCollections * 3).toFixed(1);

    const nextReservation = reservations
        .filter((r) => r.reservation.status === "confirmed")
        .sort(
            (a, b) =>
                new Date(a.reservation.collection.date).getTime() -
                new Date(b.reservation.collection.date).getTime()
        )[0];

    const handleCancel = async () => {
        if (!selectedReservation) return;

        try {
            await userService.cancelReservation(
                selectedReservation._id
            );

            toast({
                title: "Reservation cancelled",
            });

            fetchReservations();
            setSelectedReservation(null);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.response?.data?.message,
            });
        }
    };

    return (
        <main className="pt-4 pb-6 min-h-screen relative overflow-x-hidden">

            {/* Ambient decoration */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/10 rounded-full blur-[80px]" />

            <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-bold tracking-tight text-on-surface mb-2">
                        My Reservations
                    </h1>

                    <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl">
                        Manage your circular economy contributions. Track your scheduled
                        pickups and view your positive environmental footprint.
                    </p>
                </header>


                {/* Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    <StatCard
                        title="Total Collections"
                        value={String(totalCollections)}
                        subtitle={`${completedCollections} completed`}
                        icon="package_2"
                    />

                    <StatCard
                        title="CO₂ Saved"
                        value={user?.CO2Saved.toFixed(2)}
                        suffix="kg"
                        subtitle="Estimated impact"
                        icon="eco"
                        primary
                    />

                    <StatCard
                        title="Next Pickup"
                        value={
                            nextReservation
                                ? formattedDate
                                : "-"
                        }
                        subtitle={
                            formattedTime ?? "No upcoming pickups"
                        }
                        icon="schedule"
                    />

                </section>


                {/* Table */}
                <section className="bg-surface-container-low rounded-3xl p-1 overflow-hidden">

                    <div className="bg-surface-container-lowest rounded-[1.4rem] p-6 shadow-sm">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2 sm:px-4">
                            <h3 className="text-headline-md font-bold">
                                Recent Reservations
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="
                                        w-full sm:w-auto
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        shadow-sm
                                    "
                                >
                                    <option value="all">All Status</option>
                                    <option value="incoming">Incoming</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="reported">Reported</option>
                                </select>

                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="
                                        w-full sm:w-auto
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        shadow-sm
                                    "
                                >
                                    <option value="all">All Payments</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Pending</option>
                                </select>

                            </div>
                        </div>


                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full min-w-[850px] text-left border-collapse">

                                <thead>
                                    <tr className="text-label-md text-outline uppercase tracking-widest border-b">
                                        <th className="pb-6 px-3 lg:px-4">Waste Type</th>
                                        <th className="pb-6 px-3 lg:px-4">Date & Time</th>
                                        <th className="pb-6 px-3 lg:px-4">Payment</th>
                                        <th className="pb-6 px-3 lg:px-4">Status</th>
                                        <th className="pb-6 px-3 lg:px-4 text-right">Actions</th>
                                    </tr>
                                </thead>


                                <tbody className="divide-y">

                                    {paginatedReservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-24">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                                        <span className="material-symbols-outlined text-5xl text-primary">
                                                            event_busy
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold">
                                                        No pickups found
                                                    </h3>

                                                    <p className="mt-3 max-w-md text-slate-500">
                                                        You don't have any reservations matching the selected filters.
                                                        Schedule your first pickup to start recycling with Colibris.
                                                    </p>

                                                    <Link
                                                        href="/dashboard/bookings"
                                                        className="
                                                            mt-8
                                                            rounded-xl
                                                            bg-primary
                                                            px-6
                                                            py-3
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:opacity-90
                                                        "
                                                    >
                                                        Book a Pickup
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedReservations.map((history) => {

                                            const reservation = history.reservation;

                                            return (

                                                <tr
                                                    key={history._id}
                                                    className="group transition hover:bg-surface-container-low"
                                                >

                                                    {/* Collection */}

                                                    <td className="px-3 lg:px-4 py-5 lg:py-6">

                                                        <div className="flex items-center gap-4">

                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

                                                                <span className="material-symbols-outlined text-primary">
                                                                    recycling
                                                                </span>

                                                            </div>

                                                            <div>

                                                                <p className="font-bold">
                                                                    {reservation.collectionType}
                                                                </p>

                                                                <p className="text-sm text-on-surface-variant">
                                                                    {reservation.estimatedVolume}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* Pickup */}

                                                    <td className="px-3 lg:px-4 py-5 lg:py-6">

                                                        <div>

                                                            <p className="font-semibold">
                                                                {new Date(
                                                                    reservation.collection.date
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            <p className="text-sm text-on-surface-variant">
                                                                {reservation.selectedTime}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500 truncate max-w-[180px] lg:max-w-xs">
                                                                {reservation.tempLocation}
                                                            </p>

                                                        </div>

                                                    </td>

                                                    {/* Payment */}

                                                    <td className="px-3 lg:px-4 py-5 lg:py-6">

                                                        <div className="space-y-2">

                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-bold
                                                        ${reservation.isPaid
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-amber-100 text-amber-700"
                                                                    }`}
                                                            >
                                                                {reservation.isPaid ? "Paid" : "Pending"}
                                                            </span>

                                                            <p className="text-xs text-slate-500">

                                                                {reservation.collection.prix > 0
                                                                    ? `${reservation.collection.prix} TND`
                                                                    : "Free"}

                                                            </p>

                                                        </div>

                                                    </td>

                                                    {/* Status */}

                                                    <td className="px-3 lg:px-4 py-5 lg:py-6">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize
                                                    ${reservation.status === "incoming"
                                                                    ? "bg-sky-100 text-sky-700"
                                                                    : reservation.status === "confirmed"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : reservation.status === "cancelled"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : reservation.status === "reported"
                                                                                ? "bg-orange-100 text-orange-700"
                                                                                : "bg-slate-100 text-slate-700"
                                                                }`}
                                                        >
                                                            {reservation.status}
                                                        </span>

                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-3 lg:px-4 py-5 lg:py-6 text-right">
                                                        <button
                                                            onClick={() => setManagingHistory(history)}
                                                            className="
 rounded-full
 bg-primary
 px-4
 lg:px-5
 py-2
 text-sm
 font-semibold
 text-white
 transition
 hover:opacity-90
 whitespace-nowrap
 "
                                                        >
                                                            Manage
                                                        </button>
                                                    </td>

                                                </tr>

                                            );

                                        }))}

                                </tbody>

                            </table>
                            <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">

                                {/* Results info */}
                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                    <span>
                                        Showing
                                    </span>

                                    <span className="rounded-lg bg-white px-2 py-1 font-semibold text-slate-700 shadow-sm">
                                        {paginatedReservations.length}
                                    </span>

                                    <span>
                                        of
                                    </span>

                                    <span className="rounded-lg bg-white px-2 py-1 font-semibold text-slate-700 shadow-sm">
                                        {filteredReservations.length}
                                    </span>

                                    <span>
                                        reservations
                                    </span>

                                </div>


                                {/* Pagination */}
                                <div className="flex items-center justify-center sm:justify-end gap-2">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((page) => page - 1)}
                                        className="
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            sm:px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
        "
                                    >
                                        ← Previous
                                    </button>


                                    <div
                                        className="
            rounded-xl
            bg-primary/10
            px-3
            sm:px-4
            py-2
            text-sm
            font-bold
            text-primary
            whitespace-nowrap
        "
                                    >
                                        Page {currentPage}{" "}
                                        <span className="text-slate-400">/</span>{" "}
                                        {Math.max(totalPages, 1)}
                                    </div>


                                    <button
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage((page) => page + 1)}
                                        className="
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            sm:px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
        "
                                    >
                                        Next →
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>
                {managingHistory && (
                    <ManageReservationModal
                        history={managingHistory}
                        onClose={() => setManagingHistory(null)}
                        onSuccess={() => fetchReservations()}
                    />
                )}

            </div>

        </main>
    );
}



function StatCard({
    title,
    value,
    suffix,
    subtitle,
    icon,
    primary = false,
}: {
    title: string;
    value: string;
    suffix?: string;
    subtitle: string;
    icon: string;
    primary?: boolean;
}) {

    return (
        <div
            className={`rounded-2xl p-5 sm:p-8 relative overflow-hidden ${primary
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low"
                }`}
        >

            <p className="text-label-md font-bold uppercase tracking-widest mb-4">
                {title}
            </p>

            <h2 className="text-4xl sm:text-display-lg font-extrabold">
                {value}
                {suffix && (
                    <span className="text-headline-md font-medium">
                        {" "}
                        {suffix}
                    </span>
                )}
            </h2>

            <p className="text-label-lg mt-2">
                {subtitle}
            </p>


            <span
                className="absolute -bottom-4 -right-4 material-symbols-outlined text-[120px] opacity-10"
                style={{
                    fontVariationSettings: "'FILL' 1",
                }}
            >
                {icon}
            </span>

        </div>
    );
}