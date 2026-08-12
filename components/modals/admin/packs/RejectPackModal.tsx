import { User } from "@/types/api";

interface RejectPurchaseModalProps {
    open: boolean;
    user: User | null;
    packName?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
}

export default function RejectPurchaseModal({
    open,
    user,
    packName,
    loading = false,
    onClose,
    onConfirm,
}: RejectPurchaseModalProps) {
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2rem] bg-surface-container-lowest shadow-xl p-8">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-container">
                    <span className="material-symbols-outlined text-error text-3xl">
                        delete
                    </span>
                </div>

                <h2 className="mt-6 text-center text-2xl font-bold">
                    Reject Purchase
                </h2>

                <p className="mt-4 text-center text-on-surface-variant">
                    Are you sure you want to reject
                    {packName && (
                        <>
                            <span className="font-semibold text-on-surface">
                                {" "}{packName}
                            </span>
                            {" "}for
                        </>
                    )}
                    <span className="font-semibold text-on-surface">
                        {" "}{user.name}
                    </span>
                    ?
                </p>

                <p className="mt-2 text-center text-sm text-on-surface-variant">
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl bg-surface-container-high px-5 py-2 hover:bg-surface-container-highest"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-error px-5 py-2 text-on-error hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Rejecting..." : "Reject"}
                    </button>

                </div>

            </div>
        </div>
    );
}