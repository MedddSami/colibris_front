import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { Reservation } from "@/types/api";
import { adminService } from "@/services/adminService";

interface Props {
    reservation: Reservation;
    action: "accept" | "refuse";
    onClose: () => void;
    onSuccess: () => void;
}

export function AdminReservationDecisionModal({
    reservation,
    action,
    onClose,
    onSuccess,
}: Props) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedTime, setSelectedTime] = useState(
        reservation.selectedTime ?? ""
    );

    const originalCollection =
        typeof reservation.collection === "object"
            ? reservation.collection
            : null;

    const suggestedCollection =
        typeof reservation.suggestedCollection === "object"
            ? reservation.suggestedCollection
            : null;

    const isReportedFlow = reservation.status === "reported";
    const targetCollection = isReportedFlow
        ? reservation.suggestedCollection
        : reservation.collection;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await adminService.updateReservation(reservation._id, {
                action,
                selectedTime: selectedTime || undefined,
            });

            toast({
                title:
                    action === "accept"
                        ? "Reservation confirmed"
                        : "Reservation refused",
                description:
                    action === "accept"
                        ? "The user has been notified by email."
                        : "The user has been notified of the refusal.",
            });

            onSuccess();
            onClose();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Action failed",
                description:
                    (err as any)?.response?.data?.msg ??
                    "Could not update this reservation.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div
                    className={`p-6 ${action === "accept"
                            ? "bg-emerald-50 border-b border-emerald-200"
                            : "bg-red-50 border-b border-red-200"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isReportedFlow
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-sky-100 text-sky-700"
                                    }`}
                            >
                                {isReportedFlow
                                    ? "Reported Reservation"
                                    : "Waitlisted Reservation"}
                            </span>

                            <h2 className="mt-3 text-2xl font-bold text-gray-900">
                                {isReportedFlow
                                    ? action === "accept"
                                        ? "Approve Collection Change"
                                        : "Reject Collection Change"
                                    : action === "accept"
                                        ? "Approve Reservation"
                                        : "Reject Reservation"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                {isReportedFlow
                                    ? action === "accept"
                                        ? "The reservation will be moved to the requested collection."
                                        : "The reservation will remain on its original collection."
                                    : action === "accept"
                                        ? "This reservation will be confirmed."
                                        : "This reservation will be refused."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Customer */}
                    <div className="rounded-2xl bg-slate-50 p-5">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Customer
                        </h3>

                        <div className="text-lg font-semibold">
                            {typeof reservation.user === "object"
                                ? reservation.user.name
                                : "Unknown"}
                        </div>

                        {typeof reservation.user === "object" && (
                            <p className="mt-1 text-sm text-slate-500">
                                {reservation.user.email}
                            </p>
                        )}
                    </div>

                    {/* Collections */}
                    {isReportedFlow ? (
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Requested Change
                            </h3>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                <div className="rounded-2xl border bg-slate-50 p-5">
                                    <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                                        Current Collection
                                    </p>

                                    <h4 className="text-lg font-bold">
                                        {originalCollection?.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {originalCollection?.date &&
                                            new Date(
                                                originalCollection.date
                                            ).toLocaleDateString()}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        {reservation.selectedTime}
                                    </p>
                                </div>

                                <div className="text-3xl text-slate-400">→</div>

                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                    <p className="mb-2 text-xs font-semibold uppercase text-emerald-700">
                                        Requested Collection
                                    </p>

                                    <h4 className="text-lg font-bold">
                                        {suggestedCollection?.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-slate-600">
                                        {suggestedCollection?.date &&
                                            new Date(
                                                suggestedCollection.date
                                            ).toLocaleDateString()}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        {suggestedCollection?.time?.join(" • ")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Collection
                            </h3>

                            <h4 className="text-lg font-bold">
                                {targetCollection?.title}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                {targetCollection?.date &&
                                    new Date(
                                        targetCollection.date
                                    ).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {/* Time selection */}
                    {action === "accept" && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Assign Time Slot
                            </h3>

                            <div className="space-y-3">
                                {targetCollection?.time?.map((slot: string) => (
                                    <label
                                        key={slot}
                                        className={`flex cursor-pointer items-center rounded-2xl border p-4 transition ${selectedTime === slot
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-primary/30"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            checked={selectedTime === slot}
                                            onChange={() =>
                                                setSelectedTime(slot)
                                            }
                                            className="mr-3"
                                        />

                                        <span className="font-medium">
                                            {slot}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t bg-slate-50 p-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-5 py-2 font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`rounded-xl px-6 py-2 font-semibold text-white transition ${action === "accept"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-red-600 hover:bg-red-700"
                            } disabled:opacity-50`}
                    >
                        {loading
                            ? "Processing..."
                            : action === "accept"
                                ? "Confirm"
                                : "Refuse"}
                    </button>
                </div>
            </div>
        </div>
    );
}