import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Collection, Reservation } from "@/types/api";
import { userService } from "@/services/userService";
import { normalizeCollections } from "@/utils/collectionMapper";

interface Props {
    reservation: Reservation;
    onClose: () => void;
    onSuccess: () => void;
}

export function SuggestNewDateModal({ reservation, onClose, onSuccess }: Props) {
    const { toast } = useToast();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        userService
            .getAvailableCollections()
            .then((collections) => {
                setCollections(normalizeCollections(collections));
            })
            .catch(() =>
                toast({
                    variant: "destructive",
                    title: "Could not load collections",
                    description: "Please try again later.",
                })
            )
            .finally(() => setFetching(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async () => {
        if (!selectedId) return;

        setLoading(true);
        try {
            await userService.reportReservation(reservation._id, selectedId, {
                selectedTime: reservation.selectedTime,
            });
            toast({
                title: "Date suggested",
                description: "The admin will review your suggested date.",
            });
            onSuccess();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Could not suggest a new date",
                description: (err as any)?.response?.data?.msg ?? "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-gray-900">Suggest a new date</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    Pick an available collection you'd prefer instead.
                </p>

                <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                    {fetching && (
                        <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
                    )}

                    {!fetching && collections.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">
                            No available collections right now.
                        </p>
                    )}

                    {collections.map((c) => (
                        <label
                            key={c._id}
                            className={`flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition-colors ${selectedId === c._id
                                ? "border-primary bg-primary/5"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                                <p className="text-xs text-gray-500">
                                    {c.date} — {c.time?.join(" - ")}
                                </p>
                            </div>
                            <input
                                type="radio"

                                name="suggested-collection"
                                checked={selectedId === c._id}
                                onChange={() => setSelectedId(c._id)}
                            />
                        </label>
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedId}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Suggest this date"}
                    </button>
                </div>
            </div>
        </div>
    );
}