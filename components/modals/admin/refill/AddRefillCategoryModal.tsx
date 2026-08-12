"use client";

import { useState } from "react";

import { refillService } from "@/services/refillService";
import { categoryService } from "@/services/categoryService";
import { CreateCategoryPayload } from "@/types/category";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddRefillCategoryModal({
    open,
    onClose,
    onSuccess,
}: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = {
                name,
                description
            } as CreateCategoryPayload;

            await categoryService.createCategory(payload);

            onSuccess();
            onClose();
            setName("");
            setDescription("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6">
                <h2 className="text-xl font-bold">
                    Add Category
                </h2>

                <p className="mt- text-sm text-on-surface-variant">
                    Create a new refill category.
                </p>
                <div className="space-y-2 mt-4">
                    <label className="text-label-md font-bold text-on-surface">
                        Name
                    </label>
                    <input
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Category Name"
                        className="mt-2 w-full rounded-xl bg-surface-container-high p-3"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface">
                        Description
                    </label>
                    <input
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Category Description"
                        className="mt-2 w-full rounded-xl bg-surface-container-high p-3"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="rounded-xl bg-primary px-4 py-2 text-on-primary"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}