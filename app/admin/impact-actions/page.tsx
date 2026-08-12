"use client"

import ActionCard from "@/components/modals/admin/Actions/ActionCard";
import ActionDetailsModal from "@/components/modals/admin/Actions/ActionDetailsModal";
import AddActionModal from "@/components/modals/admin/Actions/AddActionModal";
import { adminService } from "@/services/adminService";
import { Action } from "@/types/api";
import { useEffect, useMemo, useState } from "react";

export default function ImpactActionDashboard() {

    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const [selectedDetails, setSelectedDetails] =
        useState<Action | null>(null);

    const [showActionModal, setShowActionModal] =
        useState(false);

    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchActions = async () => {
        try {
            setLoading(true);
            const data = await adminService.getActions();
            setActions(data.actions ?? data); // depending on API shape
        } catch (err) {
            console.error(err);
            setError("Failed to load actions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActions();
    }, []);

    const activeActions = useMemo(
        () => actions.filter(a => a.status === "active"),
        [actions]
    );

    const ACTIONS_PER_PAGE = 4;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(
        activeActions.length / ACTIONS_PER_PAGE
    );

    const paginatedActions = activeActions.slice(
        (currentPage - 1) * ACTIONS_PER_PAGE,
        currentPage * ACTIONS_PER_PAGE
    );


    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteAction(id);
            setActions(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const completedActions = actions.filter(
        (action) => action.status === "completed"
    );

    const expiredActions = actions.filter(
        (action) => action.status === "expired"
    );

    const totalGeneratedPoints = actions.reduce(
        (sum, action) => sum + action.currentPoints,
        0
    );

    const totalTargetPoints = actions.reduce(
        (sum, action) => sum + action.targetPoints,
        0
    );

    const overallProgress =
        totalTargetPoints > 0
            ? Math.round((totalGeneratedPoints / totalTargetPoints) * 100)
            : 0;

    const totalDonations = actions.reduce(
        (sum, action) => sum + action.donations.length,
        0);

    const completedThisMonth = completedActions.filter((action) => {
        const created = new Date(action.createdAt);
        const now = new Date();

        return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
        );
    }).length;


    const COMPLETED_PER_PAGE = 3;

    const [completedPage, setCompletedPage] = useState(1);

    const completedTotalPages = Math.ceil(
        completedActions.length / COMPLETED_PER_PAGE
    );

    const paginatedCompleted = completedActions.slice(
        (completedPage - 1) * COMPLETED_PER_PAGE,
        completedPage * COMPLETED_PER_PAGE
    );

    const exportCompletedActions = () => {
        const headers = [
            "Title",
            "Description",
            "Target Points",
            "Current Points",
            "Progress %",
            "Deadline",
            "Status",
        ];

        const rows = completedActions.map((action) => {
            const progress = Math.round(
                (action.currentPoints / action.targetPoints) * 100
            );

            return [
                action.title,
                action.description,
                action.targetPoints,
                action.currentPoints,
                progress,
                action.deadline,
                action.status,
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `completed-actions-${new Date().toISOString().split("T")[0]}.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen flex">
            {/* Main Canvas */}
            <main className="flex-1 flex flex-col min-h-screen">

                {/* Content Area */}
                <div className="pt-2 max-w-12xl mx-auto w-full">
                    {/* Hero Header Section */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-display-lg font-bold text-on-surface -tracking-[0.02em] leading-tight">Impact
                                Actions</h2>
                            <p className="text-body-lg text-on-surface-variant mt-2 max-w-xl">Strategize and deploy community-driven
                                environmental campaigns to accelerate our transition to a restorative ecosystem.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedAction(null);
                                    setShowActionModal(true);
                                }}

                                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold"
                            >
                                Launch New Action
                            </button>
                        </div>
                    </div>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                        {/* Active Actions */}
                        <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between">

                            <span className="text-label-md font-bold text-primary tracking-widest uppercase">
                                Active Actions
                            </span>

                            <div className="mt-4">
                                <span className="text-5xl font-bold text-on-surface">
                                    {activeActions.length}
                                </span>

                                <span className="text-primary text-body-lg ml-2 font-medium">
                                    {completedThisMonth} completed this month
                                </span>
                            </div>

                        </div>

                        {/* Generated Points */}
                        <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between">

                            <span className="text-label-md font-bold text-secondary tracking-widest uppercase">
                                Points Generated
                            </span>

                            <div className="mt-4">
                                <span className="text-5xl font-bold text-on-surface">
                                    {totalGeneratedPoints.toLocaleString()}
                                </span>

                                <span className="text-secondary text-body-lg ml-2 font-medium">
                                    {overallProgress}% of target
                                </span>
                            </div>

                        </div>

                        {/* Donations */}
                        <div className="bg-primary-container p-8 rounded-2xl flex flex-col justify-between text-on-primary">

                            <span className="text-label-md font-bold opacity-80 tracking-widest uppercase">
                                Community Donations
                            </span>

                            <div className="mt-4">
                                <span className="text-5xl font-bold">
                                    {totalDonations}
                                </span>

                                <span className="opacity-80 text-body-lg ml-2 font-medium">
                                    Contributions
                                </span>
                            </div>

                        </div>

                    </div>
                    {/* Active Campaigns Grid */}
                    <h3 className="text-headline-md font-bold text-on-surface mb-8">
                        Active Initiatives
                    </h3>

                    <div className="space-y-8">

                        {/* Cards */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {paginatedActions.length > 0 ? (

                                paginatedActions.map((action) => (

                                    <ActionCard
                                        key={action._id}
                                        action={action}
                                        onClick={() => {
                                            setSelectedDetails(action);
                                            setShowDetailsModal(true);


                                        }}
                                        onEdit={() => {
                                            setSelectedAction(action);
                                            setShowActionModal(true);
                                        }}
                                        onDelete={() => handleDelete(action._id)}
                                    />

                                ))

                            ) : (

                                <div className="col-span-2 rounded-3xl border border-dashed border-outline-variant/20 py-20 text-center">

                                    <span className="material-symbols-outlined text-6xl text-outline">
                                        eco
                                    </span>

                                    <h3 className="mt-4 text-2xl font-bold">
                                        No Active Initiatives
                                    </h3>

                                    <p className="text-on-surface-variant mt-2">
                                        Launch your first environmental action to start collecting community donations.
                                    </p>

                                </div>

                            )}

                        </div>

                        {/* Footer */}

                        <div className="flex flex-col md:flex-row items-center justify-end gap-6">

                            <p className="text-sm text-on-surface-variant">

                                Showing{" "}
                                {(currentPage - 1) * ACTIONS_PER_PAGE + 1}
                                {" - "}
                                {Math.min(
                                    currentPage * ACTIONS_PER_PAGE,
                                    activeActions.length
                                )}
                                {" of "}
                                {activeActions.length}
                                {" active initiatives"}

                            </p>

                            {totalPages > 1 && (

                                <div className="flex items-center gap-2">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => p - 1)
                                        }
                                        className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-40 hover:bg-surface-container"
                                    >
                                        <span className="material-symbols-outlined">
                                            chevron_left
                                        </span>
                                    </button>

                                    {Array.from({
                                        length: totalPages,
                                    }).map((_, index) => (

                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentPage(index + 1)
                                            }
                                            className={`w-10 h-10 rounded-xl transition ${currentPage === index + 1
                                                ? "bg-primary text-on-primary"
                                                : "bg-surface-container-low hover:bg-surface-container"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>

                                    ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) => p + 1)
                                        }
                                        className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-40 hover:bg-surface-container"
                                    >
                                        <span className="material-symbols-outlined">
                                            chevron_right
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Past Actions Table Section */}
                    <div className="bg-surface-container-low rounded-3xl p-10 mt-4">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-headline-md font-bold text-on-surface">
                                Completed Initiatives
                            </h3>

                            <button
                                onClick={exportCompletedActions}
                                className="text-primary font-bold flex items-center gap-2"
                            >
                                Export Report
                                <span className="material-symbols-outlined">download</span>
                            </button>
                        </div>

                        {paginatedCompleted.length === 0 ? (
                            <div className="py-12 text-center text-on-surface-variant">
                                No completed initiatives yet
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {paginatedCompleted.map((action) => {
                                    const progress = Math.round(
                                        (action.currentPoints / action.targetPoints) * 100
                                    );

                                    return (
                                        <div
                                            key={action._id}
                                            className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl hover:bg-white transition-colors"
                                        >
                                            {/* LEFT */}
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
                                                    <span
                                                        className="material-symbols-outlined text-3xl"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                                    >
                                                        eco
                                                    </span>
                                                </div>

                                                <div>
                                                    <h5 className="font-bold text-on-surface text-body-lg">
                                                        {action.title}
                                                    </h5>

                                                    <p className="text-label-md text-on-surface-variant font-medium">
                                                        Completed{" "}
                                                        {new Date(action.deadline).toLocaleDateString()} •{" "}
                                                        {action.currentPoints.toLocaleString()} points total
                                                    </p>
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="flex items-center gap-12">
                                                <div className="text-right">
                                                    <span className="text-label-md font-bold text-primary block">
                                                        Goal Reached
                                                    </span>

                                                    <span className="text-body-lg font-bold text-on-surface">
                                                        {progress}%
                                                    </span>
                                                </div>

                                                <span className="px-4 py-1 bg-primary/10 text-primary text-label-md font-bold rounded-full uppercase tracking-tighter">
                                                    Archived
                                                </span>

                                                <button className="p-2 text-outline hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">
                                                        more_vert
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {completedTotalPages > 1 && (
                            <div className="flex items-center justify-between mt-8">
                                <p className="text-sm text-on-surface-variant">
                                    Showing {paginatedCompleted.length} of {completedActions.length} completed actions
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        disabled={completedPage === 1}
                                        onClick={() => setCompletedPage((p) => p - 1)}
                                        className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-40"
                                    >
                                        <span className="material-symbols-outlined">
                                            chevron_left
                                        </span>
                                    </button>

                                    {Array.from({ length: completedTotalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCompletedPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl ${completedPage === i + 1
                                                ? "bg-primary text-on-primary"
                                                : "bg-surface-container-low"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={completedPage === completedTotalPages}
                                        onClick={() => setCompletedPage((p) => p + 1)}
                                        className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-40"
                                    >
                                        <span className="material-symbols-outlined">
                                            chevron_right
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                        <AddActionModal
                            open={showActionModal}
                            initialData={selectedAction}
                            onClose={() => {
                                setShowActionModal(false);
                                setSelectedAction(null);
                            }}
                            onSuccess={fetchActions}
                        />
                        <ActionDetailsModal
                            open={showDetailsModal}
                            selectedAction={selectedDetails}
                            onClose={() => {
                                setShowDetailsModal(false);
                                setSelectedAction(null);
                            }}
                            onEdit={() => {
                                setShowDetailsModal(false);
                                setShowActionModal(true);
                            }}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}