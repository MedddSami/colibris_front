"use client";

import { useEffect, useState } from "react";
import { packService } from "@/services/packService";
import { Pack } from "@/types/api";

interface Props {
    open: boolean;
    pack?: Pack | null;
    onClose: () => void;
    onSuccess: () => void;
}

const initialForm = {
    name: "",
    description: "",
    price: 0,
    points: 0,
    period: 1,
    collecteNumber: 1,
    isDisplayed: false,
};

export default function AddPackModal({
    open,
    pack,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [form, setForm] = useState(initialForm);

    const isEditing = !!pack;

    useEffect(() => {
        if (!open) return;

        if (!pack) {
            setForm(initialForm);
            setImage(null);
            return;
        }

        setForm({
            name: pack.name ?? "",
            description: pack.description ?? "",
            price: pack.price ?? 0,
            points: pack.points ?? 0,
            period: (pack as any).period ?? 1,
            collecteNumber: (pack as any).collecteNumber ?? 1,
            isDisplayed: pack.isDisplayed ?? false,
        });

        setImage(null);
    }, [pack, open]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", String(form.price));
            formData.append("points", String(form.points));
            formData.append("period", String(form.period));
            formData.append("collecteNumber", String(form.collecteNumber));
            formData.append("isDisplayed", String(form.isDisplayed));

            if (image) {
                formData.append("photo", image);
            }

            if (isEditing && pack) {
                await packService.updatePack(pack._id, formData);
            } else {
                await packService.createPack(formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl bg-surface-container-low p-6">
                <h2 className="text-xl font-bold">
                    {isEditing ? "Edit Pack" : "Add Pack"}
                </h2>

                <p className="text-on-surface-variant mb-4">
                    {isEditing
                        ? "Update subscription pack"
                        : "Create a new subscription pack"}
                </p>

                <div className="space-y-4">

                    {/* Name */}
                    <label className="text-label-md font-bold text-on-surface">
                        Name
                    </label>
                    <input
                        className="w-full p-3 rounded-xl bg-surface-container-high"
                        placeholder="Pack name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    {/* Description */}
                    <label className="text-label-md font-bold text-on-surface">
                        Description
                    </label>
                    <textarea
                        className="w-full p-3 rounded-xl bg-surface-container-high"
                        placeholder="Description"
                        rows={3}
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                    />

                    {/* Price + Points */}
                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-label-md font-bold text-on-surface">
                            Price
                        </label>
                        <input
                            type="number"
                            className="p-3 rounded-xl bg-surface-container-high"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: Number(e.target.value),
                                })
                            }
                        />

                        <label className="text-label-md font-bold text-on-surface">
                            Reward Points
                        </label>
                        <input
                            type="number"
                            className="p-3 rounded-xl bg-surface-container-high"
                            placeholder="Points"
                            value={form.points}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    points: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    {/* Period + Collections */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            className="p-3 rounded-xl bg-surface-container-high"
                            placeholder="Period (months)"
                            value={form.period}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    period: Number(e.target.value),
                                })
                            }
                        />
                        <label className="text-label-md font-bold text-on-surface">
                            Period (months)
                        </label>


                        <input
                            type="number"
                            className="p-3 rounded-xl bg-surface-container-high"
                            placeholder="Free pickups"
                            value={form.collecteNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    collecteNumber: Number(e.target.value),
                                })
                            }
                        />
                        <label className="text-label-md font-bold text-on-surface">
                            Free Pickups
                        </label>
                    </div>

                    {/* Display toggle */}
                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            checked={form.isDisplayed}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    isDisplayed: e.target.checked,
                                })
                            }
                        />
                        Display this pack for public
                    </label>

                    {/* Image */}
                    <label className="text-label-md font-bold text-on-surface">
                        Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files?.[0] ?? null)
                        }
                    />

                    {/* Error */}
                    {error && (
                        <div className="text-sm text-error bg-error-container p-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary"
                        >
                            {isEditing ? "Update" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}