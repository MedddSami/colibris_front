import { adminService } from "@/services/adminService";
import { useEffect, useState } from "react";

interface Collection {
    _id: string;
    title: string;
    date: string;
    time: [string, string];
    maxCollection: number;
    prix: number;
}

interface ManageCollectionModalProps {
    open: boolean;
    date: Date;
    collections: Collection[];
    onClose: () => void;
    onUpdated: () => void;
    onDeleted: () => void;
}

export default function ManageCollectionModal({
    open,
    date,
    collections,
    onClose,
    onUpdated,
    onDeleted,
}: ManageCollectionModalProps) {
    const [selectedId, setSelectedId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: "",
        date: "",
        time1: "",
        time2: "",
        maxCollection: 0,
        prix: 0,
    });

    const selectedCollection = collections.find(
        (c) => c._id === selectedId
    );

    useEffect(() => {
        if (!collections.length) return;

        const first = collections[0];

        const [day, month, year] = first.date.split("/");

        setSelectedId(first._id);

        setForm({
            title: first.title,
            date: `${year}-${month}-${day}`,
            time1: first.time[0] ?? "",
            time2: first.time[1] ?? "",
            maxCollection: first.maxCollection,
            prix: first.prix,
        });

        console.log("form.date", form.date);
    }, [collections]);

    useEffect(() => {
        if (!selectedCollection) return;

        const [day, month, year] =
            selectedCollection.date.split("/");

        setForm({
            title: selectedCollection.title,
            date: `${year}-${month}-${day}`,
            time1: selectedCollection.time[0] ?? "",
            time2: selectedCollection.time[1] ?? "",
            maxCollection: selectedCollection.maxCollection,
            prix: selectedCollection.prix,
        });
    }, [selectedCollection]);

    if (!open) return null;

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError(null);

            await adminService.updateCollection(selectedId, {
                title: form.title,
                date: form.date,
                time: [form.time1, form.time2],
                maxCollection: form.maxCollection,
                prix: form.prix,
            });

            onUpdated();
            onClose();
        } catch (err: any) {
            setError(
                err?.response?.data?.msg ||
                "Unable to update collection."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Delete this collection permanently?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            await adminService.deleteCollection(selectedId);

            onDeleted();
            onClose();
        } catch (err: any) {
            setError(
                err?.response?.data?.msg ||
                "Unable to delete collection."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6 shadow-2xl">

                <div className="mb-6 flex flex-1 items-center justify-between">
                    <h2 className="text-title-large font-bold">
                        Manage Pickup Details
                    </h2>
                    <p className="font-sm">
                        Update or Delete the Informations of the pickup accordingly
                    </p>

                    <button
                        onClick={onClose}
                        className="rounded-xl px-3 py-2 hover:bg-surface-container"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {collections.length > 1 && (
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold">
                            Select Pickup
                        </label>

                        <select
                            value={selectedId}
                            onChange={(e) =>
                                setSelectedId(e.target.value)
                            }
                            className="w-full rounded-xl bg-surface-container-high p-3"
                        >
                            {collections.map((collection) => (
                                <option
                                    key={collection._id}
                                    value={collection._id}
                                >
                                    {collection.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-label-md font-bold text-on-surface">
                            Collection Title
                        </label>

                        <input
                            className="w-full rounded-xl bg-surface-container-high p-3"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-label-md font-bold text-on-surface">
                            Collection Date
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-xl bg-surface-container-high p-3"
                            value={form.date}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    date: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-label-md font-bold text-on-surface">
                            Collection Time Slots
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                className="rounded-xl bg-surface-container-high p-3 text-sm"
                                placeholder="8h-10h"
                                value={form.time1}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        time1: e.target.value,
                                    })
                                }
                            />

                            <input
                                className="rounded-xl bg-surface-container-high p-3 text-sm"
                                placeholder="14h-16h"
                                value={form.time2}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        time2: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">

                        <div className="grid grid-cols-2 gap-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Max Pickups
                            </label>
                            <input
                                type="number"
                                className="rounded-xl bg-surface-container-high p-3"
                                value={form.maxCollection}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        maxCollection: Number(e.target.value),
                                    })
                                }
                            />
                            <label className="text-label-md font-bold text-on-surface">
                                Price (TND)
                            </label>

                            <input
                                type="number"
                                className="rounded-xl bg-surface-container-high p-3"
                                value={form.prix}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        prix: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                    >
                        Delete
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="rounded-xl px-4 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="rounded-xl bg-primary px-4 py-2 font-bold text-on-primary"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}