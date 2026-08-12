"use client";

import { X } from "lucide-react";

interface ReservationDetailsModalProps {
    reservation: any;
    open: boolean;
    onClose: () => void;
}

export default function ReservationDetailsModal({
    reservation,
    open,
    onClose,
}: ReservationDetailsModalProps) {
    if (!open || !reservation) return null;

    const collection = reservation.collection;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                        Reservation Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                    >
                        <X size={22} />
                    </button>
                </div>


                {/* Collection info */}
                <div className="space-y-4">

                    <div className="rounded-2xl bg-emerald-50 p-4">
                        <p className="text-sm font-semibold text-emerald-700">
                            Collection
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {collection?.title}
                        </p>
                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">
                                Date
                            </p>

                            <p className="mt-1 font-bold text-slate-900">
                                {collection?.date}
                            </p>
                        </div>


                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">
                                Time
                            </p>

                            <p className="mt-1 font-bold text-slate-900">
                                {reservation.selectedTime}
                            </p>
                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">
                                Material
                            </p>

                            <p className="mt-1 font-bold text-slate-900">
                                {reservation.collectionType}
                            </p>
                        </div>


                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">
                                Volume
                            </p>

                            <p className="mt-1 font-bold text-slate-900">
                                {reservation.estimatedVolume}
                            </p>
                        </div>

                    </div>


                    <div className="rounded-2xl bg-slate-50 p-4">

                        <p className="text-xs font-semibold uppercase text-slate-500">
                            Location
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {reservation.tempLocation}
                        </p>

                    </div>


                    <div className="flex items-center justify-between rounded-2xl bg-primary/10 p-4">

                        <span className="font-semibold text-slate-700">
                            Price
                        </span>

                        <span className="text-xl font-extrabold text-primary">
                            {collection?.price} TND
                        </span>

                    </div>

                </div>

            </div>
        </div>
    );
}