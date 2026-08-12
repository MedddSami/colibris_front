"use client";

import { Action } from "@/types/api";
import { useEffect, useMemo, useState } from "react";

interface DonateActionModalProps {
    open: boolean;
    action: Action | null;
    userPoints: number;
    loading: boolean;
    onClose: () => void;
    onDonate: (points: number) => Promise<void>;
}

export default function DonateActionModal({
    open,
    action,
    userPoints,
    loading,
    onClose,
    onDonate,
}: DonateActionModalProps) {

    const [points, setPoints] = useState("");

    useEffect(() => {
        if (open) {
            setPoints("");
        }
    }, [open]);

    const amount = Number(points);

    const remaining = useMemo(() => {
        return Math.max(userPoints - (amount || 0), 0);
    }, [amount, userPoints]);

    const progress = useMemo(() => {
        if (!action) return 0;

        return Math.round(
            (action.currentPoints / action.targetPoints) * 100
        );
    }, [action]);



    const submit = async () => {
        if (
            amount <= 0 ||
            amount > userPoints
        ) {
            return;
        }

        await onDonate(amount);
    };

    const maxDonation = Math.min(
        userPoints,
        remaining
    );

    if (!open || !action) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Donate Points
                        </h2>

                        <p className="mt-1 text-sm text-on-surface-variant">
                            Support this environmental initiative.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-surface-container"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>

                </div>

                {/* Initiative */}

                <div className="mt-8 rounded-2xl bg-surface-container-low p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">

                            <span className="material-symbols-outlined">
                                eco
                            </span>

                        </div>

                        <div>

                            <h3 className="font-bold">
                                {action.title}
                            </h3>

                            <p className="text-sm text-on-surface-variant">
                                {action.description}
                            </p>

                        </div>

                    </div>

                    <div className="mt-5">

                        <div className="mb-2 flex justify-between text-sm">

                            <span>{progress}% funded</span>

                            <span>
                                {action.currentPoints} / {action.targetPoints}
                            </span>

                        </div>

                        <div className="h-2 rounded-full bg-slate-200">

                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* User balance */}

                <div className="mt-6 flex justify-between rounded-xl bg-primary/10 p-4">

                    <span>Your Points</span>

                    <span className="font-bold text-primary">
                        {userPoints}
                    </span>

                </div>

                {/* Input */}

                <div className="mt-6">

                    <label className="mb-2 block text-sm font-medium">
                        Points to donate
                    </label>

                    <input
                        type="number"
                        min={1}
                        max={maxDonation}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 outline-none focus:border-primary"
                        placeholder="Enter amount"
                    />

                </div>

                {/* Quick buttons */}

                <div className="mt-4 flex flex-wrap gap-2">

                    {[25, 50, 100, 250].map((value) => (

                        <button
                            key={value}
                            onClick={() => setPoints(value.toString())}
                            className="rounded-full border px-4 py-2 text-sm hover:bg-surface-container"
                        >
                            {value}
                        </button>

                    ))}

                </div>

                {/* Footer */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-xl border px-5 py-3 font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={
                            loading ||
                            amount <= 0 ||
                            amount > maxDonation
                        }
                        onClick={submit}
                        className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50"
                    >
                        {loading
                            ? "Donating..."
                            : "Donate Points"}
                    </button>

                </div>

            </div>

        </div>
    );
}