import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";
import { SuggestNewDateModal } from "./SuggestNewDateModal";
import { Reservation } from "@/types/api";


interface Props {
    history: Reservation; // { _id, reservation, status }
    onClose: () => void;
    onSuccess: () => void;
}

export function ManageReservationModal({ history, onClose, onSuccess }: Props) {
    const { toast } = useToast();
    const reservation = history.reservation;
    const [loading, setLoading] = useState(false);
    const [suggestOpen, setSuggestOpen] = useState(false);

    const canCancel = ["pending", "confirmed"].includes(reservation.status);
    const canReport = ["pending", "confirmed"].includes(reservation.status);
    const isReported = reservation.status === "reported";

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;

        setLoading(true);
        try {
            await userService.cancelReservation(reservation._id);
            toast({
                title: "Reservation cancelled",
                description: "Your reservation has been cancelled.",
            });
            onSuccess();
            onClose();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Cancellation failed",
                description:
                    (err as any)?.response?.data?.msg ?? "Could not cancel this reservation.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-bold text-gray-900">
                        {reservation.collectionType} pickup
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(reservation.collection.date).toLocaleDateString()} —{" "}
                        {reservation.selectedTime}
                    </p>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-3 text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold">Location:</span> {reservation.tempLocation}</p>
                        <p><span className="font-semibold">Volume:</span> {reservation.estimatedVolume}</p>
                        <p><span className="font-semibold">Status:</span> {reservation.status}</p>
                        <p>
                            <span className="font-semibold">Payment:</span>{" "}
                            {reservation.isPaid ? "Paid" : "Pending"}
                        </p>
                    </div>

                    {isReported && (
                        <div className="mt-4 rounded-2xl bg-orange-50 text-orange-700 text-sm p-3">
                            You've suggested a new date for this reservation. Waiting for
                            admin approval — no further action needed right now.
                        </div>
                    )}

                    <div className="mt-6 flex flex-col gap-2">
                        {canReport && (
                            <button
                                onClick={() => setSuggestOpen(true)}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                            >
                                Report pickup
                            </button>
                        )}

                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Cancelling..." : "Cancel reservation"}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {suggestOpen && (
                <SuggestNewDateModal
                    reservation={reservation}
                    onClose={() => setSuggestOpen(false)}
                    onSuccess={() => {
                        setSuggestOpen(false);
                        onSuccess();
                        onClose();
                    }}
                />
            )}
        </>
    );
}