"use client";

import { Reservation } from "@/types/api";
import { X } from "lucide-react";

interface ReservationViewModalProps {
    open: boolean;
    reservation: Reservation | null;
    onClose: () => void;
}

export default function ReservationViewModal({
    open,
    reservation,
    onClose,
}: ReservationViewModalProps) {
    if (!open || !reservation) return null;

    const user =
        typeof reservation.user === "object"
            ? reservation.user
            : null;

    const collection =
        typeof reservation.collection === "object"
            ? reservation.collection
            : null;

    const suggestedCollection =
        typeof reservation.suggestedCollection === "object"
            ? reservation.suggestedCollection
            : null;

    const statusClass = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-blue-100 text-blue-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
        reported: "bg-orange-100 text-orange-700",
    }[reservation.status] ?? "bg-slate-100 text-slate-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b p-8">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Reservation Details
                        </h2>

                        <p className="mt-1 text-sm text-on-surface-variant">
                            Complete reservation information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-surface-container"
                    >
                        <X size={22} />
                    </button>

                </div>

                <div className="space-y-6 p-8">

                    {/* USER */}

                    <div className="rounded-2xl bg-surface-container-low p-6">

                        <h3 className="mb-5 text-lg font-bold">
                            User Information
                        </h3>

                        <div className="flex items-center gap-5">

                            <img
                                src={
                                    user?.profileImage || "/default-avatar.png"
                                }
                                alt={user?.name}
                                className="h-20 w-20 rounded-2xl object-cover"
                            />

                            <div className="space-y-1">

                                <h4 className="text-xl font-bold">
                                    {user?.name}
                                </h4>

                                <p className="text-on-surface-variant">
                                    {user?.email}
                                </p>

                                <p className="text-on-surface-variant">
                                    {user?.number?.[0] ?? "-"}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Reservation */}

                    <div className="rounded-2xl bg-surface-container-low p-6">

                        <h3 className="mb-5 text-lg font-bold">
                            Reservation
                        </h3>

                        <div className="grid grid-cols-2 gap-5">

                            <Info
                                title="Collection"
                                value={collection?.title ?? "-"}
                            />

                            <Info
                                title="Date"
                                value={
                                    collection?.date
                                        ? new Date(
                                            collection.date
                                        ).toLocaleDateString()
                                        : "-"
                                }
                            />

                            <Info
                                title="Selected Time"
                                value={reservation.selectedTime}
                            />

                            <Info
                                title="Estimated Volume"
                                value={
                                    reservation.estimatedVolume
                                }
                            />

                            <Info
                                title="Collection Type"
                                value={
                                    reservation.collectionType
                                }
                            />

                            <Info
                                title="Price"
                                value={`${collection?.prix ?? 0} TND`}
                            />

                        </div>

                    </div>

                    {reservation.status === "reported" && suggestedCollection && (
                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
                            <h3 className="mb-5 text-lg font-bold text-orange-700">
                                Suggested Collection
                            </h3>

                            <p className="mb-4 text-sm text-orange-600">
                                The user requested to move this reservation to the following
                                collection.
                            </p>

                            <div className="grid grid-cols-2 gap-5">
                                <Info
                                    title="Collection"
                                    value={suggestedCollection.title}
                                />

                                <Info
                                    title="Date"
                                    value={
                                        suggestedCollection.date
                                            ? new Date(
                                                suggestedCollection.date
                                            ).toLocaleDateString()
                                            : "-"
                                    }
                                />

                                <Info
                                    title="Available Time Slots"
                                    value={suggestedCollection.time?.join(" / ") ?? "-"}
                                />

                                <Info
                                    title="Price"
                                    value={`${suggestedCollection.prix ?? 0} TND`}
                                />

                                <Info
                                    title="Empty slots"
                                    value={`${suggestedCollection.maxCollection ?? 0} still empty`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Address */}

                    <div className="rounded-2xl bg-surface-container-low p-6">

                        <h3 className="mb-5 text-lg font-bold">
                            Pickup Address
                        </h3>

                        <p className="leading-relaxed text-on-surface-variant">
                            {reservation.tempLocation}
                        </p>

                    </div>

                    {/* Status */}

                    <div className="grid grid-cols-2 gap-6">

                        <div className="rounded-2xl bg-surface-container-low p-6">

                            <h3 className="mb-4 font-bold">
                                Reservation Status
                            </h3>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${statusClass}`}
                            >
                                {reservation.status}
                            </span>

                        </div>

                        <div className="rounded-2xl bg-surface-container-low p-6">

                            <h3 className="mb-4 font-bold">
                                Payment
                            </h3>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-bold ${reservation.isPaid
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {reservation.isPaid
                                    ? "Paid"
                                    : "Pending Payment"}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end border-t p-6">

                    <button
                        onClick={onClose}
                        className="rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

function Info({
    title,
    value,
}: {
    title: string;
    value: React.ReactNode;
}) {
    return (
        <div>

            <p className="mb-1 text-sm text-on-surface-variant">
                {title}
            </p>

            <p className="font-semibold">
                {value || "-"}
            </p>

        </div>
    );
}