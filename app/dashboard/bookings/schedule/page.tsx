"use client";

import { userService } from "@/services/userService";
import { setCollectionId, setEstimatedVolumeOther, setSelectedTime, setCollectionDate, setEstimatedVolume, setCollection } from "@/store/slices/bookingSlice";
import { Collection, EstimatedVolume } from "@/types/api";
import { normalizeCollections } from "@/utils/collectionMapper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function BookingSchedulePage() {
    const dispatch = useDispatch();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const router = useRouter();

    const [collections, setCollections] = useState<Collection[]>([]);

    const [weekOffset, setWeekOffset] = useState(0);

    const estimatedVolume = useSelector(
        (state: any) => state.booking.estimatedVolume
    );

    const estimatedVolumeOther = useSelector(
        (state: any) => state.booking.estimatedVolumeOther
    );

    const selectedCollectionId = useSelector(
        (state: any) => state.booking.collectionId
    );

    const selectedTime = useSelector(
        (state: any) => state.booking.selectedTime
    );

    const selectedDate = useSelector(
        (state: any) => state.booking.collectionDate
    );


    const volumeOptions: {
        value: EstimatedVolume;
        label: string;
        sub: string;
    }[] = [
            {
                value: "Un sac (20-30L)",
                label: "Small",
                sub: "20-30L",
            },
            {
                value: "Carton (30-50L)",
                label: "Medium",
                sub: "30-50L",
            },
            {
                value: "Plusieurs sacs",
                label: "Large",
                sub: "Multiple",
            },
            {
                value: "Autre",
                label: "Other",
                sub: "Custom volume",
            },
        ];

    useEffect(() => {
        const load = async () => {
            try {
                const data = await userService.getAvailableCollections();
                setCollections(data);
            } catch (err) {
                console.error("Failed to load collections", err);
            }
        };

        load();
    }, []);

    useEffect(() => {
        dispatch(setSelectedTime(""));
    }, [selectedCollectionId]);

    const normalizedCollections = useMemo(() => {
        return normalizeCollections(collections);
    }, [collections]);

    const finalVolume =
        estimatedVolume === "Autre"
            ? estimatedVolumeOther
            : estimatedVolume;

    const getTwoWeekDays = (offset = 0) => {
        const today = new Date();

        // Find Monday of current week
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const start = new Date(today);
        start.setDate(today.getDate() + mondayOffset + offset * 14);

        return Array.from({ length: 14 }).map((_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);

            return {
                date,
                dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
                dayNumber: date.getDate(),
                fullDate: date.toISOString().split("T")[0],
            };
        });
    };

    const weekDays = getTwoWeekDays(weekOffset);

    const isDayAvailable = (dateStr: string) => {
        return normalizedCollections.some(
            (c) => c.isoDate === dateStr
        );
    };

    const firstMonth = weekDays[0]?.date?.toLocaleDateString("en-US", { month: "short" });
    const lastMonth = weekDays[13]?.date?.toLocaleDateString("en-US", { month: "short" });
    const year = weekDays[0]?.date?.getFullYear();

    const monthLabel =
        firstMonth === lastMonth
            ? `${firstMonth} ${year}`
            : `${firstMonth} – ${lastMonth} ${year}`;

    const selectedCollection = normalizedCollections.find(
        (c) => c._id === selectedCollectionId
    );

    const formatTimeSlot = (slot: string) => {
        // "8h-10h" OR "8:00 - 10h"
        const clean = slot
            .replace(/h/g, ":00")
            .replace(/\s+/g, " ")
            .trim();

        const [startRaw] = clean.split("-");

        const startHour = parseInt(startRaw);

        let period = "Morning";

        if (startHour >= 12 && startHour < 17) period = "Afternoon";
        else if (startHour >= 17) period = "Evening";

        return {
            label: clean.replace("-", " - "),
            period,
        };
    };


    return (
        <div className="min-h-screen bg-surface text-on-surface flex flex-col">

            {/* Main */}
            <main className="container mx-auto max-w-12xl flex-grow px-6 py-12">
                {/* Stepper */}
                <div className="mb-12 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                            1
                        </div>

                        <span className="text-sm font-bold text-primary">
                            Waste Type
                        </span>
                    </div>

                    <div className="h-px w-12 bg-outline-variant/30" />

                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary-container shadow-lg shadow-primary/20">
                            2
                        </div>

                        <span className="text-sm font-bold text-on-surface">
                            Schedule
                        </span>
                    </div>

                    <div className="h-px w-12 bg-outline-variant/30" />

                    <div className="flex items-center gap-2 opacity-40">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-sm font-bold text-on-surface">
                            3
                        </div>

                        <span className="text-sm font-medium">
                            Details
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="mb-4 text-[3.5rem] font-bold leading-tight tracking-tight text-on-surface">
                        Select your collection slot.
                    </h1>

                    <p className="max-w-xl text-on-surface-variant">
                        Choose a date, the location and volume that fits your schedule.
                        Our team will ensure the rest of the logistics.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Calendar */}
                    <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-8 lg:col-span-7">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-on-surface">
                                Available Days
                            </h2>

                            <p className="text-sm text-on-surface-variant mt-1">
                                {monthLabel}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setWeekOffset((prev) => prev - 1)}
                                    className="rounded-full p-2 transition-colors hover:bg-surface-container"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_left
                                    </span>
                                </button>

                                <button
                                    onClick={() => setWeekOffset((prev) => prev + 1)}
                                    className="rounded-full p-2 transition-colors hover:bg-surface-container"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Weekdays */}
                        <div className="mb-4 grid grid-cols-7 gap-4 text-center">
                            {days.map((day) => (
                                <span
                                    key={day}
                                    className="text-xs font-bold uppercase tracking-widest text-outline"
                                >
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-4">
                            {weekDays.map((day) => {
                                //const available = isDayAvailable(day.fullDate);

                                const match = normalizedCollections.find(
                                    c => c.isoDate === day.fullDate
                                );
                                const title = match?.title;

                                const selected = selectedCollection?._id === match?._id;

                                const remainingSlots = match
                                    ? match.maxCollection - (match.booked || 0)
                                    : 0;

                                const available = match && remainingSlots > 0;

                                return (
                                    <button
                                        key={day.fullDate}
                                        disabled={!available}
                                        onClick={() => {
                                            const match = normalizedCollections.find(
                                                c => c.isoDate === day.fullDate
                                            );

                                            if (match && remainingSlots > 0) {
                                                dispatch(setCollectionId(match._id))
                                                dispatch(
                                                    setCollection({
                                                        _id: match._id,
                                                        title: match.title,
                                                        date: day.fullDate,
                                                        time: match.time,
                                                        prix: match.prix,
                                                        maxCollection: match.maxCollection,
                                                        booked: match.booked,
                                                    })
                                                );
                                            }
                                        }}
                                        className={`
                                            flex min-h-[130px] flex-col items-center justify-start py-3 px-2 rounded-xl transition-all
                                            ${!available
                                                ? "text-outline/30 cursor-not-allowed"
                                                : selected
                                                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.1]"
                                                    : "bg-surface-container-lowest hover:bg-primary/5"
                                            }
                                        `}
                                    >
                                        {/* Title */}
                                        {match?.title && (
                                            <span className={`
                                                mt-1 text-[10px] font-semibold text-center
                                                ${selected ? "text-on-primary/90" : "text-on-surface-variant"}
                                            `}>
                                                {match.title}
                                            </span>
                                        )}
                                        <span className="text-sm font-bold">
                                            {day.dayNumber}
                                        </span>

                                        {available && (
                                            <div
                                                className={`mt-1 h-1 w-1 rounded-full ${selected ? "bg-on-primary" : "bg-primary"
                                                    }`}
                                            />
                                        )}
                                        {/* Remaining slots indicator */}
                                        {match && (
                                            <span
                                                className={`
                                                    mt-1 text-[10px] font-bold
                                                    ${selected
                                                        ? remainingSlots === 0
                                                            ? "text-on-primary/70"
                                                            : "text-on-primary/90"
                                                        : remainingSlots === 0
                                                            ? "text-error"
                                                            : remainingSlots <= 2
                                                                ? "text-orange-500"
                                                                : "text-primary"
                                                    }
                                                `}
                                            >
                                                {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} available
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 flex items-center gap-4 border-t border-outline-variant/10 pt-8">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-primary" />

                                <span className="text-xs font-medium text-on-surface-variant">
                                    Selected
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full border border-primary-container" />

                                <span className="text-xs font-medium text-on-surface-variant">
                                    Available
                                </span>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                            <button
                                onClick={() => router.push("/dashboard/bookings")}
                                className="flex-1 rounded-full border border-outline-variant px-8 py-4 font-bold text-secondary transition-colors hover:bg-surface-container-low active:scale-95"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => router.push("/dashboard/bookings/confirm")}
                                className="flex-[2] rounded-full bg-primary px-8 py-4 font-bold text-on-primary shadow-xl shadow-primary/20 transition-all hover:bg-primary-container active:scale-95"
                            >
                                Proceed to Confirmation
                            </button>
                        </div>
                    </div>



                    {/* Right Side */}
                    <div className="space-y-8 lg:col-span-5">
                        {/* Volume */}
                        <section className="rounded-xl bg-surface-container-low p-8">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-on-surface">
                                <span className="material-symbols-outlined text-primary">
                                    eco
                                </span>
                                Collection Volume
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {volumeOptions.map((opt) => {
                                    const selected = estimatedVolume === opt.value;

                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => dispatch(setEstimatedVolume(opt.value))}
                                            className={`
                                                    flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all active:scale-95
                                                ${selected
                                                    ? "border-primary bg-primary-container text-on-primary-container shadow-lg shadow-primary/20"
                                                    : "border-transparent bg-surface-container-lowest hover:border-primary-container"
                                                }
                                            `}
                                        >
                                            <span className="text-sm font-extrabold">
                                                {opt.label}
                                            </span>

                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {opt.sub}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom input for "Autre" */}
                            {estimatedVolume === "Autre" && (
                                <div className="mt-6">
                                    <label className="mb-2 block text-xs font-bold uppercase text-on-surface-variant">
                                        Specify volume
                                    </label>

                                    <input
                                        value={estimatedVolumeOther || ""}
                                        onChange={(e) =>
                                            dispatch(setEstimatedVolumeOther(e.target.value))
                                        }
                                        placeholder="e.g. 3 large bags / 1m³ / etc..."
                                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                                    />
                                </div>
                            )}
                        </section>

                        {/* Time */}
                        <section className="rounded-xl bg-surface-container-low p-8">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-on-surface">
                                <span className="material-symbols-outlined text-primary">
                                    schedule
                                </span>
                                Time Interval
                            </h3>

                            {!selectedCollection ? (
                                <p className="text-sm text-on-surface-variant italic">
                                    Please select a collection date first
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {selectedCollection.time.map((slot) => {
                                        //const meta = getTimeMeta(slot);
                                        const selected = selectedTime === slot;

                                        const { label, period } = formatTimeSlot(slot);

                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => dispatch(setSelectedTime(slot))}
                                                className={`flex w-full items-center justify-between rounded-xl px-6 py-4 transition-colors ${selected
                                                    ? "border-2 border-primary bg-surface-container-lowest"
                                                    : "border border-outline-variant/20 bg-surface-container-lowest hover:bg-white"
                                                    }`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-bold text-on-surface">
                                                        {label}
                                                    </span>

                                                    <span className="text-[10px] font-bold text-primary">
                                                        {period}
                                                    </span>
                                                </div>

                                                <span
                                                    className={`material-symbols-outlined ${selected ? "text-primary" : "text-outline-variant"
                                                        }`}
                                                    style={{
                                                        fontVariationSettings: selected
                                                            ? "'FILL' 1"
                                                            : "'FILL' 0",
                                                    }}
                                                >
                                                    {selected ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* Impact Card */}
                <div className="relative mt-16 overflow-hidden rounded-3xl bg-emerald-900 p-10">
                    <div className="absolute inset-0 opacity-10">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkuA8jYEqgPDG4VvyBwyCgo-ZGDnH_XYGUBKbAPguWMRbfZraQ1VG1R3DVPM-v7VNB9q-AHolbIvVB5uAjtpL33PAZ_ZJiLk9KdWWpDTFEdF2PpM8-u2OZM5frLsMhiknrKiOTU6B1uQ3TOSFHZKMxTe1BvG2cROtqHvj5XHYXdJ3r9452KZFAye1blaRNgHOZkkY-U1GfFW1H0TAli9TCKvRwYIhP16vq4AXGUHUemU_tsLA5M_yiBeeOj_AJof2n_Yxxw-PsB5g_"
                            alt="Nature background"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
                        <div className="flex-1">
                            <span className="mb-4 inline-block rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary">
                                Impact Insight
                            </span>

                            <h2 className="mb-4 text-3xl font-bold text-white">
                                Every collection saves approximately 4.2kg of CO2.
                            </h2>

                            <p className="max-w-md leading-relaxed text-emerald-100/80">
                                By scheduling your collection, you contribute to
                                a localized circular economy reducing emissions.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-emerald-500/30">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />

                                <span className="text-3xl font-extrabold text-white">
                                    88%
                                </span>
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                                Local Efficiency
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}