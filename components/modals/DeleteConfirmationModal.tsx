"use client";

interface Props {
    open: boolean;
    title?: string;
    message?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
    open,
    title = "Delete Item",
    message = "Are you sure you want to delete this item?",
    loading = false,
    onClose,
    onConfirm,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6 shadow-xl">

                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            {title}
                        </h2>

                        <p className="text-sm text-on-surface-variant">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <p className="mb-6 text-on-surface">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-4 py-2 hover:bg-surface-container-high"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className="rounded-xl bg-error px-4 py-2 text-white"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}