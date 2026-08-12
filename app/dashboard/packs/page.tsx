"use client";

import { authService } from "@/services/authService";
import { packService } from "@/services/packService";
import { useToast } from "@/hooks/use-toast";
import { Pack, User } from "@/types/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationPicker from "@/components/auth/LocationPicker";
import { userService } from "@/services/userService";

export default function SubscriptionPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [packs, setPacks] = useState<Pack[]>([]);
    const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const [selectedPack, setSelectedPack] = useState<string | null>(null);
    const [deliveryOption, setDeliveryOption] = useState<"custom" | "collection">("collection");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [location, setLocation] = useState("");

    const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const [lat, setLat] = useState<string>("");
    const [lng, setLng] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const [nextCollection, setNextCollection] = useState<{
        date: string | null;
    } | null>(null);

    const [loadingNextCollection, setLoadingNextCollection] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [packsData, userData] = await Promise.all([
                    packService.getDisplayedPacks(),
                    authService.getProfile(),
                ]);

                setPacks(packsData);
                setUser(userData);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);

    useEffect(() => {
        const loadNextCollection = async () => {
            try {
                const data = await userService.getNextBookedCollection();
                setNextCollection(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingNextCollection(false);
            }
        };

        loadNextCollection();
    }, []);

    const handlePurchase = async (packId: string) => {
        try {
            setLoadingPackId(packId);
            setError(null);

            await packService.purchasePack(packId, {
                deliveryOption,
                deliveryDate: deliveryOption === "custom" ? deliveryDate : undefined,
                location: location || undefined,
            });

            //toast("Pack purchased successfully", {
            //    description: "Your request has been submitted for processing",
            //});

            router.push("/dashboard"); // or keep user here
        } catch (err: any) {
            setError(err?.response?.data?.message || "Purchase failed");
        } finally {
            setLoadingPackId(null);
        }
    };

    const canPurchase =
        deliveryOption &&
        (deliveryOption === "collection" || deliveryDate);

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-GB"); // gives DD/MM/YYYY

    const activePack = user?.purchasedPacks?.find(
        (pack) => pack.status === "granted"
    );

    const currentPack = packs.find(
        (pack) => pack._id === activePack?.packId
    );

    const isPackActive =
        activePack?.accessUntil &&
        new Date(activePack.accessUntil) > new Date();

    return (
        <main className="flex-1 pb-24 lg:pb-32 px-8 min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-8 pb-4 pt-4">
                <div className="relative mx-auto max-w-12xl">
                    <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">
                        Sustainable Membership
                    </span>

                    <h1 className="mb-6 max-w-2xl text-5xl font-bold tracking-tight text-on-surface leading-[1.1] md:text-6xl">
                        Curated Packs for a{" "}
                        <span className="italic text-primary">
                            Thriving Planet.
                        </span>
                    </h1>

                    <p className="mb-8 max-w-lg text-body-lg leading-relaxed text-on-surface-variant">
                        Choose a subscription bundle that fits your lifestyle.
                        Each pack is designed to maximize your ecological
                        footprint reduction while providing exclusive benefits
                        and early access to our refill gallery.
                    </p>
                </div>

                <div className="absolute -right- -top-12 h-96 w-96 rounded-full bg-primary-container/20 blur-[100px]" />

                <div className="pointer-events-none absolute bottom-0 right-24 h-full w-1/3 opacity-70">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBld9Y-sme475wffN8ES-nvC4VfrUv-u95PIJc2OFvRDcfOH17DcLySaqx6Vqq6G90v2313t2qAHKEcg5ZXrl-tDhlUViyeTScGbu1hZykm6ZND5QIbj3PRs9E9RTqTniSBLsttuVEaBkLR2AMS1EBhA3tek76GtM4zRCuC7cAyDCNE6V-96mmobVWccl9GoJBb5xf4IClNs9HhznqRTXFFG52lnrQ4eHGx7gym2hM0MOFvIoKzppA2H6Cn5LLO5XaO-fomh5oqBi_s"
                        alt="Nature background"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>

            {activePack && currentPack && (
                <section className="px-8 pt-8">
                    <div className="mx-auto max-w-6xl">

                        <div
                            className="
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    bg-gradient-to-br
                    from-primary
                    to-emerald-600
                    p-8
                    text-white
                    shadow-xl
                "
                        >

                            {/* Decorative blur */}
                            <div
                                className="
                        absolute
                        -right-20
                        -top-20
                        h-64
                        w-64
                        rounded-full
                        bg-white/20
                        blur-3xl
                    "
                            />


                            <div className="relative">

                                {/* Header */}
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                                    <div>
                                        <span
                                            className="
                                    inline-flex
                                    rounded-full
                                    bg-white/20
                                    px-3
                                    py-1
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                "
                                        >
                                            Your Current Membership
                                        </span>


                                        <h2 className="mt-3 text-3xl font-bold">
                                            {currentPack.name}
                                        </h2>

                                        <p className="mt-1 text-white/80">
                                            Your eco benefits are currently active.
                                        </p>
                                    </div>


                                    <div
                                        className={`
                                rounded-2xl
                                px-5
                                py-3
                                text-center
                                font-bold
                                ${isPackActive
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                            }
                            `}
                                    >
                                        {isPackActive
                                            ? "Active"
                                            : "Expired"}
                                    </div>

                                </div>


                                {/* Stats */}
                                <div
                                    className="
                            mt-8
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-3
                        "
                                >

                                    <div
                                        className="
                                rounded-2xl
                                bg-white/10
                                p-5
                                backdrop-blur
                            "
                                    >
                                        <p className="text-sm text-white/70">
                                            Free Collections Left
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {user.freeCollectes}
                                        </p>
                                    </div>


                                    <div
                                        className="
                                rounded-2xl
                                bg-white/10
                                p-5
                                backdrop-blur
                            "
                                    >
                                        <p className="text-sm text-white/70">
                                            Points Included
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {currentPack.points}
                                        </p>
                                    </div>


                                    <div
                                        className="
                                            rounded-2xl
                                            bg-white/10
                                            p-5
                                            backdrop-blur
                                        "
                                    >
                                        <p className="text-sm text-white/70">
                                            Valid Until
                                        </p>

                                        <p className="mt-2 text-xl font-bold">
                                            {new Date(
                                                activePack.accessUntil
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>


                                {/* Delivery */}
                                {activePack.location && (
                                    <div
                                        className="
                                            mt-6
                                            rounded-2xl
                                            bg-white/10
                                            p-5
                                            backdrop-blur
                                        "
                                    >
                                        <p className="text-sm text-white/70">
                                            Pickup Location
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {activePack.location}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </section>
            )}

            {/* Pricing Grid */}
            <section className="px-8 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {packs.length === 0 ? (

                            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest px-8 py-16 text-center">

                                <span className="material-symbols-outlined mb-4 text-5xl text-primary">
                                    inventory_2
                                </span>

                                <h3 className="mb-2 text-xl font-bold text-on-surface">
                                    No membership packs available
                                </h3>

                                <p className="max-w-md text-on-surface-variant">
                                    We are preparing new impact packs. Check back soon and join our
                                    regenerative community.
                                </p>

                            </div>

                        ) : (
                            packs.map((pack, index) => {
                                const featured = pack.name?.toLowerCase().includes("guardian");

                                const features = [
                                    `${pack.collecteNumber} Free Collections`,
                                    `${pack.points} Eco Points Included`,
                                    "Access to Shop & Refill Products",
                                    `Valid for ${pack.period} month${pack.period > 1 ? "s" : ""}`,
                                ];

                                const baseCard =
                                    "flex h-full flex-col rounded-3xl p-8 transition-shadow hover:shadow-xl";

                                const featuredCard =
                                    "relative z-20 scale-105 overflow-hidden bg-primary text-on-primary shadow-2xl shadow-primary/20";

                                const normalCard =
                                    "bg-surface-container-low text-on-surface";

                                return (
                                    <div
                                        key={pack._id}
                                        className={`${baseCard} ${featured ? featuredCard : normalCard}`}
                                    >
                                        {featured && (
                                            <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                                Most Popular
                                            </div>
                                        )}

                                        {/* NAME */}
                                        <h3 className="mb-2 text-xl font-bold">
                                            {pack.name?.replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </h3>

                                        {/* PRICE */}
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-3xl font-bold">
                                                {pack.price} DT
                                            </span>
                                            <span
                                                className={
                                                    featured
                                                        ? "text-emerald-100/70 text-sm"
                                                        : "text-on-surface-variant text-sm"
                                                }
                                            >
                                                / month
                                            </span>
                                        </div>

                                        {/* DESCRIPTION */}
                                        {pack.description && (
                                            <p className="mb-6 text-sm opacity-80 max-w-xs">
                                                {pack.description}
                                            </p>
                                        )}

                                        {/* FEATURES */}
                                        <ul className="mb-10 flex flex-col gap-3">
                                            {features.map((item) => (
                                                <li
                                                    key={item}
                                                    className={`flex gap-2 text-sm ${featured
                                                        ? "text-on-primary"
                                                        : "text-on-surface-variant"
                                                        }`}
                                                >
                                                    <span
                                                        className={`material-symbols-outlined text-lg ${featured
                                                            ? "text-emerald-200"
                                                            : "text-primary"
                                                            }`}
                                                        style={{
                                                            fontVariationSettings: "'FILL' 1",
                                                        }}
                                                    >
                                                        check_circle
                                                    </span>

                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* BUTTON */}
                                        <button
                                            onClick={() => {
                                                setSelectedPackId(pack._id);
                                                setOpenModal(true);
                                            }}
                                            disabled={loadingPackId === pack._id}
                                            className={
                                                featured
                                                    ? "w-full rounded-2xl bg-emerald-100 py-4 font-bold text-primary shadow-lg transition-all hover:bg-white active:scale-95 disabled:opacity-50"
                                                    : "w-full rounded-2xl border border-outline-variant/20 bg-white py-4 font-bold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50"
                                            }
                                        >
                                            {loadingPackId === pack._id
                                                ? "Processing..."
                                                : "Buy Subscription"}
                                        </button>
                                    </div>
                                );
                            }))}
                    </div>
                </div>
            </section>

            {openModal && selectedPackId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-surface p-8 shadow-xl space-y-6">

                        <h2 className="text-2xl font-bold text-on-surface">
                            Get your subscription
                        </h2>

                        {/* DELIVERY OPTION */}
                        <section className="space-y-3">
                            <h3 className="font-semibold">Delivery Method</h3>

                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4">
                                <input
                                    type="radio"
                                    checked={deliveryOption === "collection"}
                                    disabled={!nextCollection?.reservation}
                                    onChange={() => {
                                        setDeliveryOption("collection");

                                        // automatically fill everything
                                        setDeliveryDate(nextCollection?.reservation.collection.date ?? "");
                                        setLocation(nextCollection?.reservation.tempLocation ?? "");
                                        setLat(nextCollection?.reservation.lat ?? "");
                                        setLng(nextCollection?.reservation.lng ?? "");
                                    }}
                                />

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        Deliver during my next collection
                                    </p>

                                    <p className="text-sm text-on-surface-variant">
                                        Your pack will be delivered free when our team comes to collect your recyclables.
                                    </p>
                                </div>
                            </label>

                            {loadingNextCollection ? (
                                <p className="text-sm text-on-surface-variant">
                                    Checking your next collection...
                                </p>
                            ) : nextCollection?.reservation ? (
                                <div className="rounded-xl bg-primary/5 p-4 text-sm">
                                    <p className="font-semibold text-primary">
                                        Your next confirmed collection
                                    </p>

                                    <div className="mt-2 space-y-1 text-on-surface-variant">
                                        <p>
                                            <span className="font-medium text-on-surface">Date:</span>{" "}
                                            {nextCollection.reservation.collection.date}
                                        </p>

                                        <p>
                                            <span className="font-medium text-on-surface">Time:</span>{" "}
                                            {nextCollection.reservation.selectedTime}
                                        </p>

                                        <p>
                                            <span className="font-medium text-on-surface">Pickup:</span>{" "}
                                            {nextCollection.reservation.tempLocation}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-error">
                                    You don't have any upcoming confirmed collections.
                                </p>
                            )}
                            <div className="relative py-3">
                                <div className="border-t border-outline-variant" />

                                <span
                                    className="
                                absolute left-1/2 top-0
                                -translate-x-1/2 -translate-y-1/2
                                bg-surface px-5
                                text-xl font-bold
                                tracking-[0.25em]
                                text-on-surface-variant
                                "
                                >
                                    OR
                                </span>
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={deliveryOption === "custom"}
                                    onChange={() => setDeliveryOption("custom")}
                                />
                                Custom delivery date and location
                            </label>
                        </section>



                        {deliveryOption === "custom" && (
                            <section className="space-y-6">

                                <div className="space-y-2">
                                    <h3 className="font-semibold">
                                        Delivery Date
                                    </h3>

                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant bg-surface p-3"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold">
                                        Delivery Location
                                    </h3>

                                    <LocationPicker
                                        onLocationSelect={(address, lat, lng) => {
                                            setLocation(address);
                                            setLat(lat);
                                            setLng(lng);
                                        }}
                                    />

                                    {location && (
                                        <div className="rounded-xl bg-primary/5 p-4 text-sm">
                                            <span className="font-semibold">
                                                Selected location:
                                            </span>

                                            <p className="mt-1 text-on-surface-variant">
                                                {location}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </section>
                        )}

                        {/* ERROR */}
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {/* ACTIONS */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setOpenModal(false)
                                }
                                className="flex-1 rounded-xl border p-3"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={loading}
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        setError(null);

                                        if (!deliveryOption) {
                                            setError("Please choose a delivery option.");
                                            return;
                                        }

                                        if (
                                            deliveryOption === "collection" &&
                                            !nextCollection?.reservation
                                        ) {
                                            setError("No upcoming collection available.");
                                            return;
                                        }

                                        if (deliveryOption === "custom") {
                                            if (!deliveryDate) {
                                                setError("Please choose a delivery date.");
                                                return;
                                            }

                                            if (!location) {
                                                setError("Please choose a delivery location.");
                                                return;
                                            }
                                        }

                                        const finalDeliveryDate =
                                            deliveryOption === "collection"
                                                ? nextCollection!.reservation.collection.date
                                                : new Date(deliveryDate).toLocaleDateString("en-GB");

                                        const finalLocation =
                                            deliveryOption === "collection"
                                                ? nextCollection!.reservation.tempLocation
                                                : location;

                                        await packService.purchasePack(selectedPackId!, {
                                            deliveryOption,
                                            deliveryDate: finalDeliveryDate,
                                            location: finalLocation,
                                        });

                                        setOpenModal(false);
                                        setSelectedPackId(null);

                                    } catch (err: any) {
                                        setError(
                                            err?.response?.data?.message ??
                                            "Purchase failed."
                                        );
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="flex-1 rounded-xl bg-primary p-3 text-white font-bold"
                            >
                                {loading ? "Processing..." : "Confirm Purchase"}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </main >
    );
}