"use client";

import { useState } from "react";
import { adminService } from "@/services/adminService";
import { SetCollectionDatesPayload } from "@/types/admin";

interface AddCollectionModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddCollectionModal({
    open,
    onClose,
    onSuccess,
}: AddCollectionModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        date: "",
        time1: "",
        time2: "",
        maxCollection: 0,
        prix: 0,
    });

    if (!open) return null;

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const payloadForm = {
                title: form.title,
                date: form.date,
                time: [form.time1, form.time2],
                maxCollection: form.maxCollection,
                prix: form.prix,
            } as SetCollectionDatesPayload;

            await adminService.setCollectionDates(payloadForm);

            onSuccess();

            setForm({
                title: "",
                date: "",
                time1: "",
                time2: "",
                maxCollection: 0,
                prix: 0,
            });

            onClose();
        } catch (err: any) {
            console.error(err);

            const message =
                err?.response?.data?.msg ||
                err?.response?.data?.message ||
                "Something went wrong";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6 shadow-2xl">

                {/* HEADER */}
                <div className="mb-6">
                    <h2 className="text-title-lg font-bold">
                        Add Collection
                    </h2>
                    <p className="text-label-md text-on-surface-variant">
                        Create a new pickup schedule
                    </p>
                </div>


                {/* FORM */}
                <div className="space-y-5">

                    {/* Collection Title */}
                    <div className="space-y-2">
                        {error && (
                            <div className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <label className="text-label-md font-bold text-on-surface">
                            Collection Title
                        </label>

                        <input
                            className="w-full rounded-xl bg-surface-container-high p-3 text-sm outline-none"
                            placeholder="e.g. Morning Pickup"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-label-md font-bold text-on-surface">
                            Collection Date
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-xl bg-surface-container-high p-3 text-sm outline-none"
                            value={form.date}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    date: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Time Slots */}
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

                    {/* Capacity & Price */}
                    <div className="space-y-2">


                        <div className="grid grid-cols-2 gap-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Max Pickups
                            </label>
                            <input
                                type="number"
                                className="rounded-xl bg-surface-container-high p-3 text-sm"
                                placeholder="Maximum Collections"
                                value={form.maxCollection}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        maxCollection: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                            <label className="text-label-md font-bold text-on-surface">
                                Price (TND)
                            </label>

                            <input
                                type="number"
                                className="rounded-xl bg-surface-container-high p-3 text-sm"
                                placeholder="Price (TND)"
                                value={form.prix}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        prix: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                        </div>
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-md disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}