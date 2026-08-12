"use client";

import LocationPicker from "@/components/auth/LocationPicker";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { setLatitude, setLocation, setLongitude, setTempPhone, setUseFreeCollecte } from "@/store/slices/bookingSlice";
import { RootState } from "@/store/store";
import { User } from "@/types/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function BookingConfirmationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [profile, setProfile] = useState<User | null>(null);

    const [bookingError, setBookingError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await authService.getProfile();
                setProfile(user);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);

    const booking = useSelector((state: RootState) => state.booking);

    const collection = booking.collection;

    const collectionType =
        booking.wasteType === "Autre"
            ? booking.wasteTypeOther
            : booking.wasteType;

    const volume =
        booking.estimatedVolume === "Autre"
            ? booking.estimatedVolumeOther
            : booking.estimatedVolume;

    const handleBooking = async () => {
        if (!collection) return;

        setBookingError("");


        if (!canBook) {
            setBookingError(
                "Please complete all required booking information before continuing."
            );
            return;
        }

        if (!collection?._id) {
            setBookingError("Please select an available collection.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await userService.bookCollection(collection._id, {
                tempLocation: booking.tempLocation,

                lat: booking.lat,
                lng: booking.lng,

                selectedTime: booking.selectedTime,

                useFreeCollecte: booking.useFreeCollecte ?? false,

                tempPhone: booking.tempPhone,

                collectionType: booking.wasteType,
                collectionTypeOther:
                    booking.wasteTypeOther || undefined,

                estimatedVolume: booking.estimatedVolume,
                estimatedVolumeOther:
                    booking.estimatedVolumeOther || undefined,
            });

            toast({
                title: "Booking confirmed ",
                description: response.msg,
            });

            router.push("/dashboard/reservations");

        } catch (err: any) {
            const message =
                err?.response?.data?.msg ||
                err?.response?.data?.error ||
                "Unable to complete your booking. Please try again.";

            toast({
                variant: "destructive",
                title: "Booking failed",
                description: message,
            });

            setBookingError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formattedDate = booking.collectionDate
        ? new Date(collection!.date).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "short",
        })
        : "--";

    const canBook =
        !!booking.collectionId &&
        !!booking.selectedTime &&
        !!booking.wasteType &&
        !!booking.estimatedVolume &&
        (
            booking.wasteType !== "Autre" ||
            !!booking.wasteTypeOther?.trim()
        ) &&
        (
            booking.estimatedVolume !== "Autre" ||
            !!booking.estimatedVolumeOther?.trim()
        );

    return (
        <div className="min-h-screen bg-surface text-on-surface selection:bg-primary/20">

            {/* Main */}
            <main className="mx-auto flex max-w-12xl flex-col gap-12 px-6 py-12 md:py-20 lg:grid lg:grid-cols-12">
                {/* Left */}
                <div className="space-y-12 lg:col-span-7">
                    <section>
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
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                                    2
                                </div>

                                <span className="text-sm font-bold text-primary">
                                    Schedule
                                </span>
                            </div>

                            <div className="h-px w-12 bg-outline-variant/30" />

                            <div className="flex items-center gap-2 opacity-90">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary-container shadow-lg shadow-primary/20">
                                    3
                                </div>

                                <span className="text-sm font-bold text-on-surface">
                                    Details
                                </span>
                            </div>
                        </div>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                            Step 3 of 3
                        </span>

                        <h2 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-on-surface">
                            Details & Payment
                        </h2>

                        <p className="max-w-lg text-on-surface-variant">
                            Finalize your sustainable collection request.
                            Review your specifics and choose your preferred
                            contribution method.
                        </p>
                    </section>

                    {/* Payment Method */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-on-surface">
                            Payment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                            {/* Free Collection */}
                            <label className="group cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="peer sr-only"
                                    checked={booking.useFreeCollecte}
                                    disabled={!profile?.freeCollectes}
                                    onChange={() => dispatch(setUseFreeCollecte(true))}
                                />

                                <div
                                    className={`
                                        flex h-full flex-col gap-4 rounded-xl border-2 p-6 transition-all
                                        ${!profile?.freeCollectes
                                            ? "cursor-not-allowed opacity-50"
                                            : "border-transparent bg-surface-container-low peer-checked:border-primary peer-checked:bg-surface-container-lowest"
                                        }
                                    `}
                                >
                                    <span className="material-symbols-outlined text-3xl text-primary">
                                        eco
                                    </span>

                                    <div>
                                        <p className="font-bold">
                                            Free Collection
                                        </p>

                                        <p className="text-xs text-on-surface-variant">
                                            you have {profile?.freeCollectes ?? 0} remaining
                                        </p>
                                    </div>
                                </div>
                            </label>

                            {/* Cash */}

                            <label className="group cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="peer sr-only"
                                    checked={!booking.useFreeCollecte}
                                    onChange={() => dispatch(setUseFreeCollecte(false))}
                                />

                                <div className="flex h-full flex-col gap-4 rounded-xl border-2 border-transparent bg-surface-container-low p-6 transition-all peer-checked:border-primary peer-checked:bg-surface-container-lowest">
                                    <span className="material-symbols-outlined text-3xl text-primary">
                                        payments
                                    </span>

                                    <div>
                                        <p className="font-bold">
                                            Cash
                                        </p>

                                        <p className="text-xs text-on-surface-variant">
                                            Pay during pickup
                                        </p>
                                    </div>
                                </div>
                            </label>

                            {/* Stripe */}

                            <div className="opacity-50">
                                <div className="flex h-full flex-col gap-4 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6">
                                    <span className="material-symbols-outlined text-3xl">
                                        credit_card
                                    </span>

                                    <div>
                                        <p className="font-bold">
                                            Credit Card
                                        </p>

                                        <p className="text-xs text-on-surface-variant">
                                            Coming soon
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-xl font-bold">
                            Pickup Location
                        </h3>

                        <label className="flex gap-3 rounded-xl bg-surface-container-low p-5">

                            <input
                                type="radio"
                                checked={!booking.tempLocation}
                                onChange={() => {
                                    dispatch(setLocation(""));
                                    dispatch(setLatitude(undefined));
                                    dispatch(setLongitude(undefined));
                                }}
                            />


                            <div>
                                <p className="font-semibold">
                                    Use my saved address
                                </p>

                                <p className="text-sm text-on-surface-variant">
                                    {profile?.location}
                                </p>
                            </div>

                        </label>

                        <label className="flex gap-3 rounded-xl bg-surface-container-low p-5">

                            <input
                                type="radio"
                                checked={!!booking.tempLocation}
                                onChange={() => {
                                    dispatch(setLocation(" "));
                                }}
                            />

                            <div className="flex-1 space-y-4">

                                <p className="font-semibold">
                                    Choose another pickup location
                                </p>

                                {!!booking.tempLocation && (
                                    <>
                                        <LocationPicker
                                            onLocationSelect={(address, lat, lng) => {
                                                dispatch(setLocation(address));
                                                dispatch(setLatitude(Number(lat)));
                                                dispatch(setLongitude(Number(lng)));
                                            }}
                                        />

                                        {booking.tempLocation.trim() && (
                                            <div className="rounded-xl bg-surface-container-high p-4">
                                                <p className="text-xs font-bold uppercase text-on-surface-variant">
                                                    Selected Address
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {booking.tempLocation}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>

                        </label>

                    </section>

                    <section className="space-y-6">

                        <h3 className="text-xl font-bold">
                            Contact Number
                        </h3>

                        <label className="flex gap-3 rounded-xl bg-surface-container-low p-5">

                            <input
                                type="radio"
                                checked={!booking.tempPhone}
                                onChange={() => dispatch(setTempPhone(""))}
                            />

                            <div>
                                <p className="font-semibold">
                                    Use my account phone number
                                </p>

                                <p className="text-sm text-on-surface-variant">
                                    {profile?.number}
                                </p>
                            </div>

                        </label>

                        <label className="flex gap-3 rounded-xl bg-surface-container-low p-5">

                            <input
                                type="radio"
                                checked={!!booking.tempPhone}
                                onChange={() => dispatch(setTempPhone(" "))}
                            />

                            <div className="flex-1">

                                <p className="font-semibold mb-3">
                                    Use another phone number
                                </p>

                                {!!booking.tempPhone && (

                                    <input
                                        value={booking.tempPhone.trim()}
                                        maxLength={8}
                                        onChange={(e) =>
                                            dispatch(
                                                setTempPhone(
                                                    e.target.value.replace(/\D/g, "")
                                                )
                                            )
                                        }
                                        placeholder="8-digit phone number"
                                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none focus:border-primary"
                                    />

                                )}

                            </div>

                        </label>

                    </section>

                </div>

                {/* Right Summary */}
                <aside className="relative lg:col-span-5">
                    <div className="sticky top-32 space-y-8">
                        {/* Summary Card */}
                        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(20,29,32,0.06)]">
                            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>

                            <h3 className="mb-8 text-2xl font-bold text-on-surface">
                                Booking Summary
                            </h3>

                            <div className="space-y-6">
                                {/* Type */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <span className="material-symbols-outlined text-primary">
                                            recycling
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-on-surface-variant">
                                            Collection Type
                                        </p>


                                        <p className="text-lg font-bold text-on-surface">
                                            {collectionType || "--"}
                                        </p>

                                    </div>
                                </div>

                                {/* Volume */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                                        <span className="material-symbols-outlined text-secondary">
                                            inventory_2
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-on-surface-variant">
                                            Volume Estimate
                                        </p>

                                        <p className="text-lg font-bold text-on-surface">
                                            {volume || "--"}
                                        </p>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary/10">
                                        <span className="material-symbols-outlined text-tertiary">
                                            schedule
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-on-surface-variant">
                                            Scheduled Time
                                        </p>


                                        <p className="text-lg font-bold text-on-surface">
                                            {formattedDate} • {booking.selectedTime}
                                        </p>

                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mt-10 border-t border-surface-container-high pt-8">
                                <div className="mb-8 flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-on-surface-variant">
                                            Price
                                        </p>

                                        <p className="text-4xl font-extrabold text-on-surface">
                                            {collection
                                                ? `${collection.prix} TND`
                                                : "--"}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                                            Impact Reward
                                        </p>

                                        <p className="text-sm font-bold text-tertiary">
                                            +50 Eco-Points
                                        </p>
                                    </div>
                                </div>
                                {bookingError && (
                                    <div className="mt-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3">
                                        <div className="flex items-start gap-3">

                                            <span className="material-symbols-outlined text-error">
                                                error
                                            </span>

                                            <p className="text-sm text-error">
                                                {bookingError}
                                            </p>

                                        </div>
                                    </div>
                                )}

                                <button className={`
                                    flex w-full items-center justify-center gap-2 rounded-full py-5
                                    text-lg font-bold transition-all
                                    ${canBook
                                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-container"
                                        : "cursor-not-allowed bg-surface-container-high text-outline"
                                    }
                                `}
                                    disabled={!canBook}
                                    onClick={handleBooking}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin material-symbols-outlined">
                                                progress_activity
                                            </span>

                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Booking

                                            <span className="material-symbols-outlined">
                                                check_circle
                                            </span>
                                        </>
                                    )}
                                    {!canBook && (
                                        <p className="mt-3 text-center text-sm text-on-surface-variant">
                                            Select a collection, a time slot, and complete all required fields before confirming.
                                        </p>
                                    )}
                                </button>

                                <p className="mt-6 px-4 text-center text-xs text-on-surface-variant">
                                    By confirming, you agree to the EcoGallery
                                    Terms of Sustainability and our Collection
                                    Protocols.
                                </p>
                            </div>
                        </div>

                        {/* Impact Card */}
                        <div className="group relative overflow-hidden rounded-3xl bg-emerald-900 p-8 text-emerald-50">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjm0mkjlNBjJEnK5aS0a29e2Zqp0yd7hT299tJBpg4O0CfaIBZPTpvbLw6eGMnNQxa-0DwzEFtDk16uhTEj-pMn6tApWEDVBUD31Kz1lXsKBYnBEwjdBY6dlJKGRwpv_JjCVMCLjiBX5y6XipeR_KbKn8Np5-KAgQ0FLOHUe7GO0i1vXaciT9RcOSC5oKPClPcmNIxSvaqjjHNk8LkxFAmGWQOzDTfODgzQXEScF6FTmpPsH24_CurKaXkD0qCVDdJSfSMFk1Gi3UA"
                                alt="Forest"
                                fill
                                className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="relative z-10">
                                <span className="material-symbols-outlined mb-4 text-3xl">
                                    temp_preferences_eco
                                </span>

                                <p className="mb-2 text-xl font-bold leading-tight">
                                    Every booking offsets 2kg of CO2.
                                </p>

                                <p className="text-sm text-emerald-200/80">
                                    Your collective impact has helped restore 12
                                    hectares of local woodland this year.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}