"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Action } from "@/types/api";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Action | null; // 👈 EDIT MODE TRIGGER
}

export default function ActionModal({
    open,
    onClose,
    onSuccess,
    initialData,
}: Props) {
    const isEdit = !!initialData;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetPoints, setTargetPoints] = useState<number>(0);
    const [deadline, setDeadline] = useState("");

    // 👇 image state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // ✅ Fill form when editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setTargetPoints(initialData.targetPoints);

            setDeadline(
                new Date(initialData.deadline)
                    .toISOString()
                    .split("T")[0]
            );

            // show the existing image (if any) as the starting preview
            if (initialData.image) {
                setImagePreview(
                    `${process.env.NEXT_PUBLIC_API_URL}${initialData.image}`
                );
            }
        } else {
            // reset for "create" mode
            setTitle("");
            setDescription("");
            setTargetPoints(0);
            setDeadline("");
            setImageFile(null);
            setImagePreview(null);
        }
    }, [initialData, open]);

    // revoke object URLs we create so we don't leak memory
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("targetPoints", String(targetPoints));
            formData.append("deadline", deadline);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            if (isEdit && initialData) {
                await adminService.updateAction(
                    initialData._id,
                    formData
                );
            } else {
                await adminService.createAction(formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);

            // backend message handling
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while creating the action.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest p-8 rounded-3xl w-[500px]">

                {/* TITLE */}

                <h2 className="text-2xl font-bold text-on-surface">
                    {isEdit ? "Edit Impact Action" : "Create New Impact Action"}
                </h2>

                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {isEdit
                        ? "Update the details of this ongoing environmental initiative."
                        : "Launch a new environmental initiative."
                    }
                </p>

                {/* IMAGE UPLOAD */}
                <label className="text-label-md mt-4 font-bold text-on-surface block">
                    Cover Image
                </label>

                <div className="mb-3">
                    {imagePreview ? (
                        <div className="relative h-40 w-full rounded-xl overflow-hidden mb-2 bg-surface-container-low">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-40 w-full rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-2">
                            <span className="material-symbols-outlined text-4xl">
                                image
                            </span>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="w-full text-sm"
                    />
                </div>

                {/* TITLE INPUT */}
                <label className="text-label-md mt-2 font-bold text-on-surface">
                    Title
                </label>
                <input
                    className="w-full p-3 mb-3 rounded-xl bg-surface-container-low"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* DESCRIPTION */}
                <label className="text-label-md font-bold text-on-surface">
                    Description
                </label>
                <textarea
                    className="w-full p-3 mb-3 rounded-xl bg-surface-container-low"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* TARGET POINTS */}
                <label className="text-label-md font-bold text-on-surface">
                    Target Points
                </label>
                <input
                    type="number"
                    className="w-full p-3 mb-3 rounded-xl bg-surface-container-low"
                    placeholder="Target Points"
                    value={targetPoints}
                    onChange={(e) =>
                        setTargetPoints(Number(e.target.value))
                    }
                />

                {/* DEADLINE */}
                <label className="text-label-md font-bold text-on-surface">
                    Deadline
                </label>
                <input
                    type="date"
                    className="w-full p-3 mb-4 rounded-xl bg-surface-container-low"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-error-container text-error text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-surface-container-high"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl"
                    >
                        {loading
                            ? isEdit
                                ? "Updating..."
                                : "Creating..."
                            : isEdit
                                ? "Update"
                                : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}