"use client";

import { Action } from "@/types/api";


interface Props {
    action: Action;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
}

export default function ActionCard({
    action,
    onEdit,
    onDelete,
    onClick,
}: Props) {
    const progress =
        action.targetPoints > 0
            ? Math.round((action.currentPoints / action.targetPoints) * 100)
            : 0;

    const isCompleted = action.status === "completed";

    // action.image is stored as a relative path like "/uploads/actions/xyz.jpg"
    // prefix with your API base URL so it resolves to the backend, not the frontend origin
    const imageUrl = action.image
        ? `${process.env.NEXT_PUBLIC_API_URL}${action.image}`
        : null;

    return (
        <div className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_12px_32px_rgba(20,29,32,0.04)] hover:shadow-[0px_20px_48px_rgba(20,29,32,0.08)] transition-all duration-500">

            {/* HEADER IMAGE (falls back to icon if no image was uploaded) */}
            <div className="h-64 relative overflow-hidden bg-surface-container-low">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={action.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-5xl">
                            eco
                        </span>
                    </div>
                )}

                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur text-primary font-bold rounded-full uppercase tracking-widest">
                    {action.status}
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-8">
                <h4 className="text-headline-md font-bold text-on-surface">
                    {action.title}
                </h4>

                <p className="text-on-surface-variant mt-1">
                    {action.description}
                </p>

                {/* PROGRESS */}
                <div className="mt-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-primary font-bold">
                            {action.currentPoints} / {action.targetPoints} pts
                        </span>

                        <span className="font-bold text-on-surface">
                            {progress}%
                        </span>
                    </div>

                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* META */}
                <div className="mt-6 text-sm text-on-surface-variant">
                    Deadline:{" "}
                    {new Date(action.deadline).toLocaleDateString()}
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={onClick}
                        className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition"
                    >
                        Show Donations Details
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onEdit}
                            className="p-2 rounded-xl hover:bg-surface-container-high"
                        >
                            <span className="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            onClick={onDelete}
                            className="p-2 rounded-xl hover:bg-error-container text-error"
                        >
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}