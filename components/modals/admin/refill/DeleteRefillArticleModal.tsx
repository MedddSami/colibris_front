import { refillService } from "@/services/refillService";
import { RefillArticle } from "@/types/api";
import { useState } from "react";

interface Props {
    open: boolean;
    article: RefillArticle | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteRefillArticleModal({
    open,
    article,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] =
        useState(false);

    if (!open || !article) return null;

    const handleDelete = async () => {
        try {
            setLoading(true);

            await refillService.deleteRefillArticle(
                article._id
            );

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6">

                <h2 className="text-xl font-bold">
                    Delete Product
                </h2>

                <p className="mt-2 text-on-surface-variant">
                    Are you sure you want to delete
                    <span className="font-bold">
                        {" "}
                        {article.nom}
                    </span>
                    ?
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleDelete}
                        className="rounded-xl bg-error px-4 py-2 text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}