"use client";

import CalendarMonth from "@mui/icons-material/CalendarMonth";
//import EcoIcon from "@mui/icons-material/Eco";
import Payments from "@mui/icons-material/Payments";
import Visibility from "@mui/icons-material/Visibility";
import MoreVert from "@mui/icons-material/MoreVert";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import FilterList from "@mui/icons-material/FilterList";
import Download from "@mui/icons-material/Download";
import { useEffect, useRef, useState } from "react";
import { Collection, Reservation } from "@/types/api";
import { adminService } from "@/services/adminService";
import AddCollectionModal from "@/components/modals/admin/AddCollectionModal";
import ManageCollectionModal from "@/components/modals/admin/ManageCollectionModal";
import { useToast } from "@/hooks/use-toast";
import ReservationViewModal from "@/components/modals/admin/reservations/ViewDetailsModal";
import { RouteMapInitializer } from "@/utils/RouteMap";
import { exportLocationsAsCSV, exportMapAsImage, exportRouteAsPDF } from "@/utils/routeExport";
import { AdminReservationDecisionModal } from "@/components/modals/admin/reservations/AdminReservationDecision";

export default function ReservationsDashboard() {

    const { toast } = useToast();
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [currentDate, setCurrentDate] =
        useState(new Date());

    const [selectedCollection, setSelectedCollection] =
        useState<Collection | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showCollectionModal, setShowCollectionModal] =
        useState(false);

    const [selectedReservation, setSelectedReservation] =
        useState<Reservation | null>(null);

    const [showAddCollection, setShowAddCollection] =
        useState(false);

    const [showCollectionDetails, setShowCollectionDetails] =
        useState(false);

    const [showReservationDetails, setShowReservationDetails] =
        useState(false);

    const [showManageModal, setShowManageModal] = useState(false);

    const [selectedCollectionDay, setSelectedCollectionDay] = useState<null | {
        date: Date;
        collections: any[];
    }>(null);

    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [loadingAction, setLoadingAction] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const [actionLoading, setActionLoading] = useState(false);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [routeDate, setRouteDate] = useState<Date | null>(null);

    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [routeLocations, setRouteLocations] = useState<any[]>([]);
    const [orderedLocations, setOrderedLocations] = useState<any[]>([]);

    const [routeSelectionMode, setRouteSelectionMode] = useState(false);

    const [selectedRouteDate, setSelectedRouteDate] = useState<Date | null>(null);

    const [decisionReservation, setDecisionReservation] = useState<Reservation | null>(null);
    const [decisionAction, setDecisionAction] = useState<"accept" | "refuse" | null>(null);

    const mapRef = useRef<HTMLDivElement | null>(null);

    const mapInstanceRef = useRef<any>(null);

    const markerRef = useRef<any>(null);

    const routingControlRef = useRef<any>(null);

    const [statusFilter, setStatusFilter] = useState("all");

    const [paymentFilter, setPaymentFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 4;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchReservations = async (
        date?: string
    ) => {
        try {
            setLoading(true);

            const response = date
                ? await adminService.getReservationsByDate(
                    date
                )
                : await adminService.getReservations();

            setReservations(response.reservations);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollections = async () => {
        try {
            const data = await adminService.getAvailableCollections();

            setCollections(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCollections();
        fetchReservations();
    }, []);

    useEffect(() => {
    }, [collections]);


    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMarkPaid = async (
        reservationId: string
    ) => {
        try {
            setLoadingAction(true);

            await adminService.markReservationPaid(
                reservationId
            );

            toast({
                title: "Payment updated",
                description:
                    "Reservation has been marked as paid.",
            });

            fetchReservations();
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    err.response?.data?.message ??
                    "Unable to update reservation.",
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const confirmReservation = async (
        reservationId: string
    ) => {
        await adminService.respondToReservation(
            reservationId,
            {
                action: "confirm",
            }
        );

        fetchReservations();
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "reported":
                return "bg-red-100 text-red-700";

            case "cancelled":
                return "bg-gray-200 text-gray-700";

            default:
                return "bg-surface-container-high text-on-surface";
        }
    };

    const getThreeWeekView = (date: Date) => {
        const today = new Date(date);

        const monday = new Date(today);

        const day = today.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        monday.setDate(today.getDate() + diff);

        const previousMonday = new Date(monday);

        previousMonday.setDate(monday.getDate() - 7);

        return Array.from({ length: 21 }, (_, index) => {
            const current = new Date(previousMonday);

            current.setDate(previousMonday.getDate() + index);

            return current;
        });
    };

    const previousWeek = () => {
        const newDate = new Date(currentDate);

        newDate.setDate(
            currentDate.getDate() - 7
        );

        setCurrentDate(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(currentDate);

        newDate.setDate(
            currentDate.getDate() + 7
        );

        setCurrentDate(newDate);
    };

    const monthLabel =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        );

    const calendarDays =
        getThreeWeekView(currentDate);

    const reservationsByCollection = reservations.reduce(
        (acc, reservation) => {
            const id =
                typeof reservation.collection === "string"
                    ? reservation.collection
                    : reservation.collection?._id;

            if (!id) return acc;

            if (!acc[id]) acc[id] = [];

            acc[id].push(reservation);

            return acc;
        },
        {} as Record<string, Reservation[]>
    );

    const sameDay = (a: Date, b: Date) =>
        new Date(a).toDateString() ===
        new Date(b).toDateString();

    const parseCollectionDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/");

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );
    };

    const enrichedDays = calendarDays.map((date) => {
        if (!date) return null;

        const dayCollections = collections.filter((c) =>
            sameDay(parseCollectionDate(c.date), date)
        );

        const collectionReservations = dayCollections.flatMap(
            (c) => reservationsByCollection[c._id] || []
        );

        return {
            date,
            collections: dayCollections,
            reservations: collectionReservations,
            hasCollection: dayCollections.length > 0,
            reservationCount: collectionReservations.length,
        };
    });

    const filteredReservations = reservations.filter((reservation) => {
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

    const totalPages = Math.ceil(
        filteredReservations.length / ITEMS_PER_PAGE
    );

    const paginatedReservations =
        filteredReservations.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

    const monthlyRevenue = reservations.reduce((total, reservation) => {
        const price = Number(reservation.collection?.prix ?? 0);
        return total + price;
    }, 0);

    const volumeMap: Record<string, number> = {
        "Un sac (20-30L)": 25,
        "Carton (30-50L)": 40,
        "Plusieurs sacs": 75,
    };

    const totalLiters = reservations.reduce((total, reservation) => {
        const liters = volumeMap[reservation.estimatedVolume] ?? 0;
        return total + liters;
    }, 0);

    const downloadReservationsCSV = () => {
        const rows = filteredReservations.map((reservation) => {
            const user =
                typeof reservation.user === "object"
                    ? reservation.user
                    : null;

            return {
                Name: user?.name ?? "",
                Email: user?.email ?? "",
                Status: reservation.status,
                Payment: reservation.isPaid ? "Paid" : "Unpaid",
                WasteType: reservation.collectionType,
                Volume: reservation.estimatedVolume,
                Date: reservation.reservationDate
                    ? new Date(
                        reservation.reservationDate
                    ).toLocaleDateString()
                    : "",
                Time: reservation.selectedTime,
                Address: reservation.tempLocation,
            };
        });

        const headers = Object.keys(rows[0] || {});

        const csv = [
            headers.join(","),
            ...rows.map((row) =>
                headers
                    .map((header) =>
                        `"${String(
                            row[header as keyof typeof row] ?? ""
                        ).replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `reservations-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };

    const generatePickupRoute = (date: Date) => {

        setSelectedRouteDate(date);


        const filtered = reservations.filter((reservation) => {

            const collectionDate =
                reservation.collection?.date;


            if (!collectionDate) return false;


            const reservationDate =
                new Date(collectionDate);


            return (
                reservationDate.toDateString() ===
                date.toDateString()
            );
        });


        if (!filtered.length) {

            toast({
                variant: "destructive",
                title: "No reservations found",
                description:
                    "No confirmed reservations exist for this pickup date.",
            });

            return;
        }


        const formattedLocations =
            formatRouteLocations(filtered);


        setRouteLocations(formattedLocations);
        setOrderedLocations(formattedLocations);
        setIsRouteModalOpen(true);
    };

    const formatRouteLocations = (reservations: Reservation[]) => {
        return reservations.map((reservation) => ({
            reservationId: reservation._id,
            userLocation: reservation.tempLocation,
            userName:
                typeof reservation.user === "object"
                    ? reservation.user.name
                    : "Customer",
            lat: reservation.lat,
            lng: reservation.lng,
            phone: reservation.tempPhone,
            collectionType:
                reservation.collectionType === "Autre"
                    ? reservation.collectionTypeOther
                    : reservation.collectionType,
            estimatedVolume:
                reservation.estimatedVolume === "Autre"
                    ? reservation.estimatedVolumeOther
                    : reservation.estimatedVolume,
            selectedTime: reservation.selectedTime,
            status: reservation.status,
            isPaid: reservation.isPaid,
        }));
    };

    return (
        <div className="flex min-h-screen bg-background text-on-surface">

            {/* Main */}
            <main className="flex flex-1 flex-col gap-4 bg-background md:p-2 lg:p-2">
                {/* Header */}

                <section className="space-y-8 lg:max-w-12xl">
                    {/* Page Header */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <span className="text-label-md font-bold uppercase tracking-widest text-primary">
                                Management Portal
                            </span>

                            <h2 className="-mt-2 text-display-lg font-bold leading-tight">
                                Reservations
                            </h2>
                        </div>

                        <button
                            onClick={() => setRouteSelectionMode(true)}
                            className="
                            flex items-center gap-2
                            rounded-xl
                            bg-primary
                            px-5
                            py-3
                            font-bold
                            text-white
                            shadow-md
                            transition
                            hover:bg-primary/90
                            "
                        >
                            <span className="material-symbols-outlined">
                                route
                            </span>

                            Generate a Route for a pickup
                        </button>

                        <div className="flex rounded-xl bg-surface-container-high p-1">
                            <button className="rounded-lg bg-surface-container-lowest px-6 py-2 font-bold text-primary shadow-sm">
                                Calendar View
                            </button>

                            {/*<button className="rounded-lg px-6 py-2 text-on-surface-variant transition-colors hover:text-on-surface">
                                List View
                            </button>*/}
                        </div>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Calendar */}
                        <div className="overflow-hidden rounded-3xl bg-surface-container-low p-8 lg:col-span-8">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h3 className="text-title-lg font-bold">
                                        Pickup Dates
                                    </h3>

                                    <p className="text-label-md text-on-surface-variant">
                                        Schedule pickup windows for your ecosystem.
                                    </p>
                                </div>

                                <button className="flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 font-bold text-on-primary-container"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <CalendarMonth />
                                    Add Pick up Date
                                </button>
                                <AddCollectionModal
                                    open={showAddModal}
                                    onClose={() => setShowAddModal(false)}
                                    onSuccess={fetchCollections}
                                />
                            </div>

                            <div>
                                {/* Month Navigation */}
                                {routeSelectionMode && (
                                    <div className="
                                        mb-6
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        bg-primary/10
                                        p-4
                                        text-primary
                                    ">
                                        <span className="material-symbols-outlined">
                                            info
                                        </span>

                                        <p className="text-sm font-semibold">
                                            Select a pickup date from the calendar to generate the route.
                                        </p>
                                    </div>
                                )}
                                <div className="mb-6 flex items-center justify-between">
                                    <button
                                        onClick={previousWeek}
                                        className="rounded-xl bg-surface-container-high p-3 transition-colors hover:bg-surface-container-highest"
                                    >
                                        <ChevronLeft />
                                    </button>

                                    <h3 className="text-title-lg font-bold">
                                        {monthLabel}
                                    </h3>

                                    <button
                                        onClick={nextWeek}
                                        className="rounded-xl bg-surface-container-high p-3 transition-colors hover:bg-surface-container-highest"
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-4 text-center mb-2">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="text-label-md font-bold text-on-surface-variant"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-4 text-center">
                                    {enrichedDays.map((dayData, index) => {
                                        if (!dayData) {
                                            return <div key={index} className="h-32" />;
                                        }

                                        const {
                                            date,
                                            collections,
                                            reservationCount,
                                            hasCollection,
                                        } = dayData;

                                        const isToday =
                                            date.toDateString() ===
                                            new Date().toDateString();

                                        const isSelected =
                                            selectedDate?.toDateString() ===
                                            date.toDateString();

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => {

                                                    setSelectedDate(date);


                                                    // Route generation mode
                                                    if (routeSelectionMode) {

                                                        if (!hasCollection || collections.length === 0) {

                                                            toast({
                                                                variant: "destructive",
                                                                title: "No pickup available",
                                                                description:
                                                                    "There are no collections scheduled for this date.",
                                                            });

                                                            return;
                                                        }


                                                        generatePickupRoute(date);

                                                        setRouteSelectionMode(false);

                                                        return;
                                                    }


                                                    // Normal calendar behavior
                                                    if (hasCollection && collections.length > 0) {

                                                        setSelectedCollectionDay({
                                                            date,
                                                            collections,
                                                        });

                                                        setShowManageModal(true);
                                                    }
                                                }}
                                                className={`flex h-32 flex-col justify-between rounded-2xl p-3 text-left transition-all duration-200

                                                    ${isSelected
                                                        ? "bg-primary text-on-primary ring-4 ring-primary/20"
                                                        : isToday
                                                            ? "bg-surface-container-high"
                                                            : hasCollection
                                                                ? "bg-primary/5 hover:bg-primary/10"
                                                                : "bg-surface-container-lowest hover:bg-surface-container-low"
                                                    }
                                                `}
                                            >
                                                {/* DATE */}
                                                <div className="text-title-lg font-bold">
                                                    {String(date.getDate()).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </div>

                                                {/* COLLECTIONS */}
                                                <div className="flex flex-col gap-1 overflow-hidden">
                                                    {collections
                                                        .slice(0, 2)
                                                        .map((c) => (
                                                            <div
                                                                key={c._id}
                                                                className="truncate text-[15px] font-semibold"
                                                            >
                                                                {c.title}
                                                            </div>
                                                        ))}
                                                </div>

                                                {/* FOOTER INFO */}
                                                <div className="flex justify-between text-[11px] font-sm opacity-70">
                                                    <span>
                                                        {hasCollection
                                                            ? `${collections.length} pickup`
                                                            : ""}
                                                    </span>

                                                    <span>
                                                        {reservationCount > 0
                                                            ? `${reservationCount} booked`
                                                            : ""}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>


                        {/* Stats */}
                        <div className="flex flex-col gap-6 lg:col-span-4">
                            <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl bg-secondary-container p-8 text-on-secondary-container">
                                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                                <span
                                    className="material-symbols-outlined font-extrabold-2 opacity-90"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    eco
                                </span>

                                <div>
                                    <p className="text-headline-lg font-extrabold leading-none">
                                        {totalLiters}L
                                    </p>

                                    <p className="mt-2 text-label-md font-bold uppercase tracking-widest opacity-80">
                                        Liters Collected
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between rounded-3xl bg-primary-container p-8 text-on-primary-container">
                                <Payments sx={{ fontSize: 40 }} />

                                <div>
                                    <p className="text-headline-lg font-extrabold leading-none">
                                        {monthlyRevenue.toFixed(2)} TND
                                    </p>

                                    <p className="mt-2 text-label-md font-bold uppercase tracking-widest opacity-80">
                                        Total Revenue
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reservation List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-headline-md font-bold">
                                    Reservations Details
                                </h3>

                                <p className="text-body-lg text-on-surface-variant">
                                    Active reservation list for{" "}
                                    <span className="font-bold text-primary">
                                        {new Date().toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">

                                {/* Status */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant">
                                        filter_alt
                                    </span>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="appearance-none rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-primary"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="reported">Reported</option>
                                    </select>

                                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                                        expand_more
                                    </span>
                                </div>

                                {/* Payment */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant">
                                        payments
                                    </span>

                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => {
                                            setPaymentFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="appearance-none rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-primary"
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>

                                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                                        expand_more
                                    </span>
                                </div>

                                {/* Export */}
                                <button
                                    onClick={downloadReservationsCSV}
                                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary/90"
                                >
                                    <Download fontSize="small" />
                                    Export CSV
                                </button>

                            </div>
                        </div>

                        <div className=" rounded-[2rem] bg-surface-container-low p-2">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-8 py-6 text-label-md font-bold uppercase tracking-widest text-outline opacity-60">
                                <div className="col-span-3">
                                    User
                                </div>

                                <div className="col-span-2">
                                    Status
                                </div>

                                <div className="col-span-1">
                                    Payment
                                </div>

                                <div className="col-span-2">
                                    Volume
                                </div>

                                <div className="col-span-1">
                                    Type
                                </div>

                                <div className="col-span-2">
                                    Location
                                </div>

                                <div className="col-span-1 text-right">
                                    Actions
                                </div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-2">

                                {paginatedReservations.length === 0 ? (

                                    <div className="flex flex-col items-center justify-center py-20 text-center">

                                        <span className="material-symbols-outlined mb-4 text-6xl text-outline opacity-50">
                                            inbox
                                        </span>

                                        <h4 className="text-xl font-bold">
                                            No reservations found
                                        </h4>

                                        <p className="mt-2 max-w-md text-on-surface-variant">
                                            There are no reservations matching the selected filters.
                                            Try changing the filters or wait for new reservations.
                                        </p>

                                        {(statusFilter !== "all" || paymentFilter !== "all") && (
                                            <button
                                                onClick={() => {
                                                    setStatusFilter("all");
                                                    setPaymentFilter("all");
                                                }}
                                                className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    paginatedReservations.map((reservation) => {
                                        const user =
                                            typeof reservation.user === "object"
                                                ? reservation.user
                                                : null;

                                        return (
                                            <div
                                                key={reservation._id}
                                                className="grid grid-cols-12 items-center rounded-2xl bg-surface-container-lowest px-8 py-5 shadow-sm transition-all duration-300 hover:shadow-md"
                                            >
                                                {/* User */}
                                                <div className="col-span-3 flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                        <img
                                                            src={
                                                                user.profileImage
                                                                    ? `${API_URL}${user.profileImage}`
                                                                    : "/default-avatar.png"
                                                            }
                                                            alt={reservation.user.name}
                                                            className="w-12 h-12 rounded-2xl object-cover"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-bold">
                                                            {user
                                                                ? `${user.name}`
                                                                : "Unknown User"}
                                                        </p>

                                                        <p className="text-label-md text-on-surface-variant opacity-70">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="col-span-2">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-label-md font-bold capitalize ${getStatusClasses(
                                                            reservation.status
                                                        )}`}
                                                    >
                                                        {reservation.status}
                                                    </span>
                                                </div>

                                                {/* Payment */}
                                                <div className="col-span-1">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-label-md font-bold ${reservation.isPaid
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {reservation.isPaid
                                                            ? "Paid"
                                                            : "Unpaid"}
                                                    </span>
                                                </div>

                                                {/* Volume */}
                                                <div className="col-span-2">
                                                    <p className="font-medium">
                                                        {reservation.estimatedVolume ??
                                                            "-"}
                                                    </p>
                                                </div>

                                                {/* Waste Type */}
                                                <div className="col-span-1">
                                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                                        {reservation.collectionType ??
                                                            "-"}
                                                    </span>
                                                </div>

                                                {/* Location */}
                                                <div className="col-span-2">
                                                    {reservation.lat && reservation.lng ? (
                                                        <a
                                                            href={`https://www.google.com/maps?q=${reservation.lat},${reservation.lng}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-primary"
                                                        >
                                                            <span className="material-symbols-outlined text-primary text-lg">
                                                                location_on
                                                            </span>

                                                            <span
                                                                className="max-w-[180px] truncate underline-offset-4 group-hover:underline"
                                                                title={reservation.tempLocation}
                                                            >
                                                                {reservation.tempLocation || "View location"}
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-sm text-slate-400">
                                                            <span className="material-symbols-outlined text-lg">
                                                                location_off
                                                            </span>
                                                            No location
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-1 flex justify-end gap-2">
                                                    <button
                                                        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high"
                                                        onClick={() => {
                                                            setSelectedReservation(reservation);
                                                            setViewOpen(true);
                                                        }}
                                                    >
                                                        <Visibility className="text-outline" />
                                                    </button>

                                                    <div className="relative" ref={menuRef}>
                                                        <button
                                                            onClick={() =>
                                                                setOpenMenu(openMenu === reservation._id ? null : reservation._id)
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-high"
                                                        >
                                                            <MoreVert className="text-outline" />
                                                        </button>

                                                        {openMenu === reservation._id && (
                                                            <div className="absolute z-40 right-0 top-12 w-56 rounded-2xl overlay-hidden border border-outline-variant bg-surface shadow-xl">
                                                                {!reservation.isPaid && (
                                                                    <button
                                                                        onClick={() => {
                                                                            handleMarkPaid(reservation._id);
                                                                            setOpenMenu(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-container-low"
                                                                    >
                                                                        <span className="material-symbols-outlined text-primary">payments</span>
                                                                        Mark as Paid
                                                                    </button>
                                                                )}

                                                                {["pending", "reported"].includes(reservation.status) && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => {
                                                                                setDecisionReservation(reservation);
                                                                                setDecisionAction("accept");
                                                                                setOpenMenu(null);
                                                                            }}
                                                                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-container-low"
                                                                        >
                                                                            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                                                            {reservation.status === "reported"
                                                                                ? "Accept suggested date"
                                                                                : "Confirm reservation"}
                                                                        </button>

                                                                        <button
                                                                            onClick={() => {
                                                                                setDecisionReservation(reservation);
                                                                                setDecisionAction("refuse");
                                                                                setOpenMenu(null);
                                                                            }}
                                                                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-container-low"
                                                                        >
                                                                            <span className="material-symbols-outlined text-red-600">cancel</span>
                                                                            {reservation.status === "reported"
                                                                                ? "Refuse suggested date"
                                                                                : "Refuse reservation"}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-8">
                                <p>
                                    Showing{" "}
                                    <span className="font-bold">
                                        {paginatedReservations.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold">
                                        {filteredReservations.length}
                                    </span>{" "}
                                    reservations
                                </p>

                                <div className="flex items-center gap-2">
                                    <button className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl bg-surface-container-highest opacity-50"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((page) => page - 1)
                                        }
                                    >
                                        <ChevronLeft />
                                    </button>

                                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-md"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((page) => page + 1)
                                        }
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {decisionReservation && decisionAction && (
                    <AdminReservationDecisionModal
                        reservation={decisionReservation}
                        action={decisionAction}
                        onClose={() => {
                            setDecisionReservation(null);
                            setDecisionAction(null);
                        }}
                        onSuccess={() => {
                            // refetch or optimistically update your reservations list
                            fetchReservations();
                        }}
                    />
                )}
                {isRouteModalOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsRouteModalOpen(false)}
                    >
                        <div
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Generate Pickup Route
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Click anywhere on the map to set a starting point
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsRouteModalOpen(false)}
                                    className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                                    aria-label="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body: sidebar + map */}
                            <div className="flex flex-1 min-h-0">
                                {/* Sidebar: locations + reservation details */}
                                <div className="w-[320px] shrink-0 border-r border-gray-100 flex flex-col">
                                    <div className="px-5 py-3 border-b border-gray-100 shrink-0">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {routeLocations.length} pickup{routeLocations.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                                        {routeLocations.map((loc, i) => (
                                            <div
                                                key={loc.reservationId ?? i}
                                                className="rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors p-3"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                        {i + 1}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {loc.userName ?? "Unnamed"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {loc.userLocation}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                                                            {loc.selectedTime && (
                                                                <span className="inline-flex items-center gap-1">🕒 {loc.selectedTime}</span>
                                                            )}
                                                            {loc.collectionType && (
                                                                <span className="inline-flex items-center gap-1">🧴 {loc.collectionType}</span>
                                                            )}
                                                            {loc.estimatedVolume && (
                                                                <span className="inline-flex items-center gap-1">📦 {loc.estimatedVolume}</span>
                                                            )}
                                                            {loc.phone && (
                                                                <span className="inline-flex items-center gap-1">📞 {loc.phone}</span>
                                                            )}
                                                        </div>

                                                        {loc.status && (
                                                            <span
                                                                className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${loc.status === "confirmed"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-gray-100 text-gray-600"
                                                                    }`}
                                                            >
                                                                {loc.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {routeLocations.length === 0 && (
                                            <p className="text-sm text-gray-400 text-center py-8">
                                                No pickup locations added yet.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Map area */}
                                <div className="relative flex-1 min-h-0 p-4">
                                    <div
                                        ref={mapRef}
                                        className="h-full w-full rounded-2xl overflow-hidden ring-1 ring-gray-200"
                                    />

                                    <RouteMapInitializer
                                        mapRef={mapRef}
                                        mapInstanceRef={mapInstanceRef}
                                        markerRef={markerRef}
                                        routingControlRef={routingControlRef}
                                        locations={routeLocations}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!mapRef.current) return;
                                            try {
                                                await exportMapAsImage(mapRef.current);
                                            } catch {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Export failed",
                                                    description: "Could not export the map image.",
                                                });
                                            }
                                        }}
                                        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Export Map (PNG)
                                    </button>
                                    <button
                                        onClick={() => exportLocationsAsCSV(routeLocations)}
                                        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Export List (CSV)
                                    </button>
                                    <button
                                        onClick={() =>
                                            mapRef.current &&
                                            exportRouteAsPDF(
                                                mapRef.current,
                                                routeLocations,
                                                selectedRouteDate ?? new Date()
                                            )
                                        }
                                        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Export Route (PDF)
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsRouteModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsRouteModalOpen(false)}
                                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Confirm Route
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <ReservationViewModal
                    open={viewOpen}
                    reservation={selectedReservation}
                    onClose={() => {
                        setViewOpen(false);
                        setSelectedReservation(null);
                    }}
                />
                {showManageModal && selectedCollectionDay && (
                    <ManageCollectionModal
                        open={showManageModal}
                        collections={selectedCollectionDay.collections}
                        date={selectedCollectionDay.date}
                        onClose={() => {
                            setShowManageModal(false);
                            setSelectedCollectionDay(null);
                        }}
                        onUpdated={fetchCollections}
                        onDeleted={fetchCollections}
                    />
                )}
            </main>
        </div>
    );
}