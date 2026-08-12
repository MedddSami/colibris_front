"use client";

import Image from "next/image";
import { Pack } from "@/types/api";

interface Props {
    pack: Pack;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}
export default function PackCard({
    pack,
    index,
    onEdit,
    onDelete,
}: Props) {
    const featured = index % 2 === 1;

    return (
        <div
            className={`group relative rounded-[2rem] p-8 flex flex-col overflow-hidden transition-all duration-500
            ${featured
                    ? "bg-primary text-on-primary shadow-[0px_24px_48px_rgba(0,108,74,0.15)] md:scale-105"
                    : "bg-surface-container-lowest text-on-surface shadow-[0px_12px_32px_rgba(20,29,32,0.03)] hover:shadow-[0px_12px_48px_rgba(0,108,74,0.08)]"
                }`}
        >
            {/* Decorative Shape */}
            <div
                className={`absolute w-32 h-32 transition-transform duration-700 group-hover:scale-150
                ${featured
                        ? "top-0 right-0 bg-on-primary/10 rounded-bl-full -mr-8 -mt-8"
                        : "bottom-0 right-0 bg-secondary/5 rounded-tl-full -mr-8 -mb-8"
                    }`}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center
                    ${featured
                            ? "bg-on-primary/10"
                            : "bg-surface-container-low"
                        }`}
                >
                    {pack.photo ? (
                        <Image
                            src={pack.photo}
                            alt={pack.name}
                            width={48}
                            height={48}
                            className="rounded-xl object-cover"
                        />
                    ) : (
                        <span
                            className={`material-symbols-outlined fill ${featured
                                ? "text-on-primary"
                                : "text-primary"
                                }`}
                        >
                            eco
                        </span>
                    )}
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${featured
                            ? "bg-on-primary text-primary"
                            : pack.isDisplayed
                                ? "bg-primary/10 text-primary"
                                : "bg-surface-container-high text-on-surface-variant"
                        }`}
                >
                    {pack.isDisplayed ? "Displayed" : "Hidden"}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-3xl mb-2">
                {pack.name}
            </h3>

            {/* Description */}
            <p
                className={`text-lg mb-8 ${featured
                    ? "text-on-primary/80"
                    : "text-on-surface-variant"
                    }`}
            >
                {pack.description}
            </p>

            {/* Price */}
            <div className="mt-auto space-y-5">
                <div className="flex items-baseline gap-2">
                    <span
                        className={`text-5xl font-bold ${featured
                            ? "text-on-primary"
                            : "text-primary"
                            }`}
                    >
                        {pack.price} TND
                    </span>

                    <span
                        className={
                            featured
                                ? "text-on-primary/70"
                                : "text-on-surface-variant"
                        }
                    >
                        / {pack.period} month{pack.period > 1 ? "s" : ""}
                    </span>
                </div>

                {/* Features */}
                <ul
                    className={`space-y-3 pt-6 border-t ${featured
                        ? "border-on-primary/20"
                        : "border-outline-variant/20"
                        }`}
                >
                    <li className="flex items-center gap-3">
                        <span
                            className={`material-symbols-outlined text-sm ${featured
                                ? "text-on-primary"
                                : "text-primary"
                                }`}
                        >
                            check_circle
                        </span>

                        {pack.points.toLocaleString()} Points
                    </li>

                    <li className="flex items-center gap-3">
                        <span
                            className={`material-symbols-outlined text-sm ${featured
                                ? "text-on-primary"
                                : "text-primary"
                                }`}
                        >
                            check_circle
                        </span>

                        {pack.collecteNumber} Collections
                    </li>

                    <li className="flex items-center gap-3">
                        <span
                            className={`material-symbols-outlined text-sm ${featured
                                ? "text-on-primary"
                                : "text-primary"
                                }`}
                        >
                            check_circle
                        </span>

                        {pack.period} Month
                        {pack.period > 1 ? "s" : ""} Duration
                    </li>
                </ul>

                {/* Actions */}
                <div className="flex gap-3 pt-6">
                    <button
                        onClick={onEdit}
                        className={`flex-1 py-3 rounded-xl font-semibold transition
                        ${featured
                                ? "bg-on-primary text-primary hover:bg-on-primary/90"
                                : "bg-surface-container-high hover:bg-surface-container-highest"
                            }`}
                    >
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        className={`flex-1 py-3 rounded-xl font-semibold transition
                        ${featured
                                ? "bg-error text-on-error hover:opacity-90"
                                : "bg-error-container text-error hover:opacity-90"
                            }`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}