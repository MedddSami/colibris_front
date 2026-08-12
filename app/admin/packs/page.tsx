"use client"

import AddPackModal from "@/components/modals/admin/packs/AddPackModal";
import PackCard from "@/components/modals/admin/packs/PackCard";
import RejectPackModal from "@/components/modals/admin/packs/RejectPackModal";
import SubscriptionDetailsModal from "@/components/modals/admin/packs/SubscriptionDetailsModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";
import { packService } from "@/services/packService";
import { userService } from "@/services/userService";
import { Pack, User } from "@/types/api";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function PacksPage() {

    const [packs, setPacks] = useState<Pack[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showPackModal, setShowPackModal] = useState(false);

    const [selectedPack, setSelectedPack] =
        useState<Pack | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [packToDelete, setPackToDelete] =
        useState<Pack | null>(null);

    const [pendingPurchases, setPendingPurchases] = useState<User[]>([]);

    const [viewMode, setViewMode] = useState<"subscribed" | "pending">(
        "subscribed"
    );

    const [actionLoading, setActionLoading] = useState(false);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToReject, setUserToReject] = useState<User | null>(null);
    const [rejectLoading, setRejectLoading] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const { toast } = useToast();

    const fetchData = async () => {
        try {
            setLoading(true);

            const [packsData, usersData, pendingData] =
                await Promise.all([
                    packService.getPacks(),
                    adminService.getAllUsers(),
                    packService.getPendingPurchases(),
                ]);

            setPacks(packsData);
            setUsers(usersData);
            setPendingPurchases(pendingData);
        } catch (err) {
            console.error(err);
            setError("Unable to load packs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleDelete = async () => {
        if (!packToDelete) return;

        await packService.deletePack(packToDelete._id);

        setDeleteModalOpen(false);
        setPackToDelete(null);

        fetchData();
    };

    const ITEMS_PER_PAGE = 4;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode]);


    const activePacks = packs.length;

    const totalSubscribers = users.length;

    const subscribedUsers = useMemo(() => {
        return users.filter((user) =>
            user.purchasedPacks?.some((p) => p.status === "granted")
        );
    }, [users]);

    const pendingUsers = useMemo(() => {
        return pendingPurchases;
    }, [pendingPurchases]);

    const currentList =
        viewMode === "subscribed"
            ? subscribedUsers
            : pendingUsers;

    const totalItems = currentList.length;

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedUsers = currentList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getActivePack = (user: User) => {
        const purchase = user.purchasedPacks?.find(
            (p) => p.status === "granted"
        );

        if (!purchase) return null;

        const fullPack = packMap.get(
            typeof purchase.packId === "string"
                ? purchase.packId
                : purchase.packId?._id
        );

        return {
            ...purchase,
            pack: fullPack,
        };
    };

    const getPendingPack = (user: User) =>
        user.purchasedPacks?.find((p) => p.status === "pending");

    const exportUsersToCSV = () => {
        const data = currentList;

        if (!data.length) return;

        const headers = [
            "Name",
            "Email",
            "Phone",
            "Location",
            "Pack",
            "Status",
        ];

        const rows = data.map((user) => {
            const activePack = getActivePack(user);
            const pendingPack = getPendingPack(user);

            return [
                user.name,
                user.email,
                user.number?.[0] ?? "",
                user.location,
                activePack?.packId?.name ??
                pendingPack?.packId?.name ??
                "No Pack",
                viewMode,
            ];
        });

        const csvContent =
            [headers, ...rows]
                .map((row) =>
                    row.map((val) => `"${val}"`).join(",")
                )
                .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute(
            "download",
            `${viewMode}-users.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGrantAccess = async (user: User) => {
        const pendingPack = getPendingPack(user);

        if (!pendingPack) return;

        try {

            setActionLoading(true);

            await packService.grantAccess(
                user._id,
                pendingPack.packId._id
            );

            toast({
                title: "Access Granted",
                description: `${user.name} can now access the ${pendingPack.packId.name} pack.`,
            });

            await fetchData();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: "Unable to grant access.",
            });
        } finally {
            setActionLoading(false);
        }

    };

    const handleRejectConfirm = async () => {
        if (!userToReject) return;

        const pendingPack = getPendingPack(userToReject);

        if (!pendingPack) return;

        try {
            setRejectLoading(true);

            await packService.deletePurchase(
                userToReject._id,
                pendingPack.packId._id
            );

            toast({
                title: "Purchase Rejected",
                description: `${userToReject.name}'s purchase request has been rejected.`,
            });

            setRejectModalOpen(false);
            setUserToReject(null);

            await fetchData();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: "Unable to reject the purchase request. Please try again.",
            });
        } finally {
            setRejectLoading(false);
        }
    };

    const packMap = useMemo(() => {
        const map = new Map<string, Pack>();

        packs.forEach((pack) => {
            map.set(pack._id, pack);
        });

        return map;
    }, [packs]);



    //const totalRevenue = packs.reduce(
    //    (sum, pack) =>
    //        sum + pack.price * (pack.subscribers ?? 0),
    //    0
    //);

    //const popularPack = packs.reduce((best, current) =>
    //    (current.subscribers ?? 0) >
    //        (best?.subscribers ?? 0)
    //        ? current
    //        : best
    //);

    return (
        <div className="relative min-h-screen bg-surface text-on-surface overflow-hidden">
            {/* CONTENT */}
            <section className="p-2 space-y-12 max-w-12xl mx-auto w-full">
                {/* HERO */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-primary font-bold tracking-widest text-[10px] uppercase block mb-2">
                            Subscription Management
                        </span>

                        <h2 className="font-bold text-5xl md:text-6xl leading-tight tracking-tight">
                            Packs & Subscriptions
                        </h2>

                        <p className="text-on-surface-variant max-w-lg mt-2">
                            Manage your ecosystem offerings,
                            adjust pricing tiers, and track
                            active memberships within the
                            Colibris network.
                        </p>
                    </div>

                    <button className="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-[0px_12px_32px_rgba(0,108,74,0.15)] transition-all hover:-translate-y-0.5 active:scale-95"
                        onClick={() => {
                            setSelectedPack(null); // important: ensures "create mode"
                            setShowPackModal(true);
                        }}
                    >
                        <span className="material-symbols-outlined">
                            add_circle
                        </span>

                        Add New Pack
                    </button>
                </div>

                {/* PACKS *1/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packs.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-5xl mb-3 opacity-50">
                                inventory_2
                            </span>

                            <p className="text-lg font-medium">
                                No packs found
                            </p>

                            <p className="text-sm">
                                Create your first subscription pack to get started.
                            </p>
                        </div>
                    ) : (
                        packs.map((pack, index) => (
                            <PackCard
                                key={pack._id}
                                pack={pack}
                                index={index}
                                onEdit={() => {
                                    setSelectedPack(pack);
                                    setShowPackModal(true);
                                }}
                                onDelete={() => {
                                    setPackToDelete(pack);
                                    setDeleteModalOpen(true);
                                }}
                            />
                        ))
                    )}
                </div>

                {/* USERS TABLE */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-3xl">
                                Subscribed Users
                            </h3>

                            <p className="text-on-surface-variant text-sm">
                                Real-time overview of active
                                memberships and billing
                                status.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex rounded-xl bg-surface-container-high p-1">
                                <button
                                    onClick={() => setViewMode("subscribed")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all
                                        ${viewMode === "subscribed"
                                            ? "bg-primary text-on-primary shadow-sm"
                                            : "text-on-surface-variant hover:bg-surface-container-highest"
                                        }`}
                                >
                                    Subscribed
                                </button>

                                <button
                                    onClick={() => setViewMode("pending")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all
                                        ${viewMode === "pending"
                                            ? "bg-primary text-on-primary shadow-sm"
                                            : "text-on-surface-variant hover:bg-surface-container-highest"
                                        }`}
                                >
                                    Pending Subscriptions
                                </button>
                            </div>

                            <button
                                onClick={exportUsersToCSV}
                                className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-xl font-medium hover:bg-surface-container-highest transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    download
                                </span>
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(20,29,32,0.03)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        <th className="px-8 py-5 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                                            User Name
                                        </th>

                                        <th className="px-8 py-5 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                                            Contact Info
                                        </th>

                                        <th className="px-8 py-5 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                                            Location
                                        </th>

                                        <th className="px-8 py-5 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                                            Active Pack
                                        </th>

                                        <th className="px-8 py-5 text-sm font-bold text-on-surface-variant uppercase tracking-wider text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-outline-variant/10">

                                    {paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center text-on-surface-variant">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="material-symbols-outlined text-5xl mb-3 opacity-50">
                                                        group_off
                                                    </span>

                                                    <p className="text-lg font-medium">
                                                        No users found
                                                    </p>

                                                    <p className="text-sm">
                                                        {viewMode === "subscribed"
                                                            ? "No subscribed users available."
                                                            : "No pending purchase requests."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((user) => {
                                            const initials = user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase();

                                            const activePack = getActivePack(user);
                                            const pendingPack = getPendingPack(user);

                                            return (
                                                <tr
                                                    key={user._id}
                                                    className="hover:bg-surface-container-low transition-colors"
                                                >

                                                    {/* USER */}
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            {user.profileImage ? (
                                                                <img
                                                                    src={`${API_URL}${user.profileImage}`}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                    alt={user.name}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                    {initials}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <div className="font-bold">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-on-surface-variant">
                                                                    ID: {user._id.slice(-6)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* CONTACT */}
                                                    <td className="px-8 py-6">

                                                        <div className="font-medium">
                                                            {user.email}
                                                        </div>

                                                        <div className="text-sm text-on-surface-variant">
                                                            {user.number?.[0] ?? "-"}
                                                        </div>

                                                    </td>

                                                    {/* LOCATION */}
                                                    <td className="px-8 py-6">

                                                        <div className="flex items-center gap-2 text-on-surface-variant">

                                                            <span className="material-symbols-outlined text-lg">
                                                                location_on
                                                            </span>

                                                            <span className="truncate max-w-[220px]">
                                                                {user.location}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* PACK */}
                                                    <td className="px-8 py-6">
                                                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
                                                            {viewMode === "subscribed"
                                                                ? activePack?.pack?.name ?? "No Pack"
                                                                : pendingPack?.packId?.name
                                                                ?? "No Pack"}
                                                        </span>
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="px-8 py-6">
                                                        {viewMode === "pending" ? (
                                                            <div className="flex justify-end gap-2">

                                                                {/* GRANT */}
                                                                <button
                                                                    onClick={() => handleGrantAccess(user)}
                                                                    disabled={actionLoading}
                                                                    className="w-10 h-10 rounded-xl hover:bg-primary/10"
                                                                >
                                                                    <span className="material-symbols-outlined text-primary">
                                                                        check_circle
                                                                    </span>
                                                                </button>

                                                                {/* REJECT */}
                                                                <button
                                                                    onClick={() => {
                                                                        setUserToReject(user);
                                                                        setRejectModalOpen(true);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                    className="w-10 h-10 rounded-xl hover:bg-error-container"
                                                                >
                                                                    <span className="material-symbols-outlined text-error">
                                                                        close
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setDetailsOpen(true);
                                                                    }}
                                                                    className="w-10 h-10 rounded-xl hover:bg-surface-container-high"
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        visibility
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>

                                                </tr>
                                            );

                                        }))}

                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex items-center justify-between px-4 pb-8 pt-6">

                            {/* LEFT INFO */}
                            <p className="text-sm text-on-surface-variant">
                                Showing{" "}
                                {Math.min(
                                    (currentPage - 1) * ITEMS_PER_PAGE + 1,
                                    totalItems
                                )}
                                -
                                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                                {" "}of {totalItems}{" "}
                                {viewMode === "subscribed" ? "subscribed users" : "pending requests"}
                            </p>

                            <span className="text-sm text-on-surface-variant">
                                Updated just now
                            </span>

                            {/* CONTROLS */}
                            <div className="flex gap-2 items-center">

                                {/* PREV */}
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((p) => Math.max(p - 1, 1))
                                    }
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_left
                                    </span>
                                </button>

                                {/* PAGE NUMBERS */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all
                                                ${currentPage === page
                                                    ? "bg-primary text-on-primary shadow-sm"
                                                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                {/* NEXT */}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(p + 1, totalPages)
                                        )
                                    }
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* DECORATION */}
            < div className="fixed -bottom-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="fixed top-20 right-0 w-80 h-80 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

            <SubscriptionDetailsModal
                open={detailsOpen}
                user={selectedUser}
                packMap={packMap}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedUser(null);
                }}
            />

            <RejectPackModal
                open={rejectModalOpen}
                user={userToReject}
                packName={userToReject ? getPendingPack(userToReject)?.packId.name : ""}
                loading={rejectLoading}
                onClose={() => {
                    setRejectModalOpen(false);
                    setUserToReject(null);
                }}
                onConfirm={handleRejectConfirm}
            />
            <DeleteConfirmationModal
                open={deleteModalOpen}
                title="Delete Pack"
                description={`Delete ${packToDelete?.name}?`}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPackToDelete(null);
                }}
                onConfirm={handleDelete}
            />

            <AddPackModal
                open={showPackModal}
                pack={selectedPack}
                onClose={() => {
                    setShowPackModal(false);
                    setSelectedPack(null);
                }}
                onSuccess={fetchData}
            />
        </div >
    );
}