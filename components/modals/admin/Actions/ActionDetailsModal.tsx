"use client";

import { Action } from "@/types/api";
import { useMemo } from "react";

interface ActionDetailsModalProps {
    open: boolean;
    selectedAction: Action | null;
    onClose: () => void;
    onEdit: (action: Action) => void;
}

export default function ActionDetailsModal({
    open,
    selectedAction,
    onClose,
    onEdit,
}: ActionDetailsModalProps) {
    if (!open || !selectedAction) return null;

    const progress = useMemo(() => {
        if (!selectedAction.targetPoints) return 0;

        return Math.min(
            (selectedAction.currentPoints / selectedAction.targetPoints) * 100,
            100
        );
    }, [selectedAction]);

    const sortedDonations = useMemo(
        () =>
            [...selectedAction.donations].sort(
                (a, b) => b.points - a.points
            ),
        [selectedAction]
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-surface-container-lowest rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/10 p-8 flex justify-between items-start">

                    <div>

                        <h2 className="text-3xl font-bold">
                            {selectedAction.title}
                        </h2>

                        <p className="text-on-surface-variant mt-2 max-w-3xl">
                            {selectedAction.description}
                        </p>

                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={() => onEdit(selectedAction)}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary"
                        >
                            Edit
                        </button>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-surface-container-high"
                        >
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>

                    </div>

                </div>

                {/* Stats */}

                <div className="grid grid-cols-4 gap-6 p-8">

                    <div className="bg-surface-container-low rounded-2xl p-6">

                        <p className="text-sm text-on-surface-variant">
                            Target Points
                        </p>

                        <h3 className="text-3xl font-bold mt-2">
                            {selectedAction.targetPoints}
                        </h3>

                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-6">

                        <p className="text-sm text-on-surface-variant">
                            Current Points
                        </p>

                        <h3 className="text-3xl font-bold mt-2">
                            {selectedAction.currentPoints}
                        </h3>

                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-6">

                        <p className="text-sm text-on-surface-variant">
                            Deadline
                        </p>

                        <h3 className="text-lg font-semibold mt-2">
                            {new Date(selectedAction.deadline).toLocaleDateString()}
                        </h3>

                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-6">

                        <p className="text-sm text-on-surface-variant">
                            Status
                        </p>

                        <span
                            className={`inline-flex mt-3 px-3 py-1 rounded-full font-semibold ${selectedAction.status === "active"
                                ? "bg-primary/10 text-primary"
                                : selectedAction.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-error-container text-error"
                                }`}
                        >
                            {selectedAction.status}
                        </span>

                    </div>

                </div>

                {/* Progress */}

                <div className="px-8">

                    <div className="flex justify-between mb-3">

                        <span className="font-semibold">
                            Campaign Progress
                        </span>

                        <span>
                            {progress.toFixed(0)}%
                        </span>

                    </div>

                    <div className="w-full h-4 rounded-full bg-surface-container-high overflow-hidden">

                        <div
                            style={{
                                width: `${progress}%`,
                            }}
                            className="h-full bg-primary rounded-full"
                        />

                    </div>

                    <p className="mt-2 text-sm text-on-surface-variant">
                        {selectedAction.currentPoints} / {selectedAction.targetPoints} points
                    </p>

                </div>

                {/* Donations */}

                <div className="p-8">

                    <div className="flex justify-between items-center mb-6">

                        <h3 className="text-2xl font-bold">
                            Donations
                        </h3>

                        <span className="text-on-surface-variant">
                            {sortedDonations.length} donors
                        </span>

                    </div>

                    {sortedDonations.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-outline-variant/30 py-16 text-center">

                            <span className="material-symbols-outlined text-6xl text-outline">
                                volunteer_activism
                            </span>

                            <h4 className="mt-4 font-bold text-xl">
                                No donations yet
                            </h4>

                            <p className="text-on-surface-variant mt-2">
                                Donations will appear here once users start contributing.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-hidden rounded-2xl border border-outline-variant/10">

                            <table className="w-full">

                                <thead className="bg-surface-container-low">

                                    <tr>

                                        <th className="px-6 py-4 text-left">
                                            Rank
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            User
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Points
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {sortedDonations.map((donation, index) => (

                                        <tr
                                            key={index}
                                            className="border-t border-outline-variant/10"
                                        >

                                            <td className="px-6 py-5 font-bold">
                                                #{index + 1}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {donation.user.profileImage ? (
                                                        <img
                                                            src={donation.user.profileImage}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {donation.user.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold">
                                                            {donation.user.name}
                                                        </p>

                                                        <p className="text-sm text-on-surface-variant">
                                                            {donation.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 font-semibold text-primary">
                                                {donation.points} pts
                                            </td>

                                            <td className="px-6 py-5">
                                                {new Date(
                                                    donation.donatedAt
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}