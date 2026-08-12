'use client';

import BookingStepper from "@/components/booking/BookingStepper";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { setWasteType, setWasteTypeOther } from "@/store/slices/bookingSlice";

export default function Step1() {
    const wasteOptions = [
        {
            id: "Plastique",
            title: "Plastic",
            description:
                "Plastic bottles, packaging, containers, and other recyclable plastics.",
            image: "/plastic.png",
            icon: "rebase_edit",
            impactLabel: "1.7 kg CO₂e",
            impact: 1.7,
            iconBg: "bg-sky-50",
            iconColor: "text-secondary",
            hover: "hover:bg-secondary/10",
        },
        {
            id: "Papier",
            title: "Paper",
            description:
                "Newspapers, cardboard, magazines, office paper, and paper packaging.",
            icon: "description",
            image: "/paper.png",
            impactLabel: "1.3 kg CO₂e",
            impact: 1.3,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            hover: "hover:bg-amber-500/10",
        },
        {
            id: "Verre",
            title: "Glass",
            description:
                "Glass bottles, jars and recyclable glass containers.",
            image: "/glass.png",
            impactLabel: "0.3 kg CO₂e",
            impact: 0.3,
            icon: "wine_bar",
            iconBg: "bg-teal-50",
            iconColor: "text-tertiary",
            hover: "hover:bg-tertiary/10",
        },
        {
            id: "Canettes",
            title: "Cans",
            description:
                "Aluminium cans, beverage cans and other recyclable metal containers.",
            image: "/cans.png",
            impactLabel: "9.2 kg CO₂e",
            impact: 9.2,
            icon: "local_drink",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-600",
            hover: "hover:bg-slate-500/10",
        },
        {
            id: "Mixte",
            title: "Mixed",
            description:
                "A mix of recyclable materials collected together.",
            image: "/mixed.png",
            impactLabel: "1.5 kg CO₂e (average)",
            impact: 1.5,
            icon: "recycling",
            iconBg: "bg-green-50",
            iconColor: "text-primary",
            hover: "hover:bg-primary/10",
        },
        {
            id: "Autre",
            title: "Other",
            description:
                "Choose this if your waste doesn't fit any of the categories above.",
            image: "/other.png",
            impactLabel: "_-_",
            impact: 0,
            icon: "category",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            hover: "hover:bg-purple-500/10",
        },
    ];

    const dispatch = useDispatch();

    const { wasteType, wasteTypeOther } = useSelector(
        (state: RootState) => state.booking
    );

    const selectedTime = useSelector(
        (state: any) => state.booking.selectedTime
    );

    const tempLocation = useSelector(
        (state: any) => state.booking.tempLocation
    );

    const router = useRouter();

    const canContinue =
        wasteType !== "Autre" ||
        wasteTypeOther.trim().length > 0;

    const selectedWaste = wasteOptions.find(
        option => option.id === wasteType
    );

    const maxImpact = Math.max(...wasteOptions.map(w => w.impact));

    const impactPercentage = selectedWaste
        ? 20 + (selectedWaste.impact / maxImpact) * 80
        : 0;



    return (
        <>
            <main className="flex-grow max-w-12xl mx-auto w-full">
                {/* Booking Canvas */}
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Content Area (Asymmetric Layout) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Step 1: Waste Type Selection */}
                        <section className="animate-fade-in" id="step-1">
                            <div className="t-6 mb-4 flex items-center gap-4">
                                <BookingStepper step={1} />
                            </div>
                            <header className="mb-8">
                                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">What shall we
                                    collect today?</h1>
                                <p className="text-lg text-on-surface-variant max-w-xl">Choose the primary material type for your
                                    collection. Our biophilic processing center ensures 100% renewal efficiency for these
                                    categories.</p>
                            </header>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {wasteOptions.map((option) => {
                                    const selected = wasteType === option.id;

                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => dispatch(setWasteType(option.id))}
                                            className={`
                                                    group relative overflow-hidden rounded-3xl p-1 cursor-pointer transition-all
                                                ${selected
                                                    ? "bg-primary/10 ring-2 ring-primary"
                                                    : `bg-surface-container-low ${option.hover}`
                                                }
                                            `}
                                        >
                                            <div className="bg-surface-container-lowest rounded-[1.4rem] p-6 h-full flex flex-col">

                                                <div
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${option.iconBg} ${option.iconColor}`}
                                                >
                                                    <span className="material-symbols-outlined text-3xl">
                                                        {option.icon}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-on-surface mb-2">
                                                    {option.title}
                                                </h3>

                                                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                                                    {option.description}
                                                </p>

                                                <div className="mt-auto">
                                                    {selected ? (
                                                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                                            <span>Selected</span>

                                                            <span
                                                                className="material-symbols-outlined text-sm"
                                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                                            >
                                                                check_circle
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-on-surface-variant font-medium text-sm transition-colors">
                                                            Select category
                                                        </div>
                                                    )}
                                                    {selected && option.id === "Autre" && (
                                                        <div className="mb-6">
                                                            <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase">
                                                                Specify waste type
                                                            </label>

                                                            <input
                                                                type="text"
                                                                value={wasteTypeOther}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) =>
                                                                    dispatch(setWasteTypeOther(e.target.value))
                                                                }
                                                                placeholder="e.g. Textiles, Electronics..."
                                                                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </section>
                        {/* Step 2 Preview: Calendar (Simplified for Flow Context) */}
                        <section className="opacity-40 pointer-events-none" id="step-2">
                            <header className="mb-2">
                                <h2 className="text-2xl font-bold text-on-surface">
                                    Schedule Appointment
                                </h2>
                            </header>

                            <div className="flex items-center justify-center rounded-3xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-8">
                                <div className="text-center">
                                    <span className="material-symbols-outlined mb-2 text-4xl text-outline">
                                        calendar_today
                                    </span>

                                    <p className="font-medium text-on-surface-variant">
                                        Please complete step 1 to unlock the calendar
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-4 flex items-center justify-between">
                            <button className="rounded-full px-8 py-4 font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high">
                                Cancel
                            </button>

                            <button
                                disabled={!canContinue}
                                onClick={() => router.push("/dashboard/bookings/schedule")}
                                className={`flex items-center gap-2 rounded-full px-10 py-4 font-bold transition-all
                                    ${canContinue
                                        ? "bg-primary text-on-primary hover:scale-[1.02]"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next: Schedule
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    {/* Side Summary Card (Bento/Floating Style) */}
                    <aside className="lg:col-span-4 sticky top-28">
                        <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Your Collection</h4>
                                <p className="text-sm text-on-surface-variant">Summary of your eco-impact pickup reservation.</p>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden aspect-video">
                                <Image
                                    fill
                                    priority
                                    className="object-cover"
                                    src={selectedWaste?.image || "/booking/default.jpg"}
                                    alt={selectedWaste?.title || "Collection preview"}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">

                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">

                                        <span className="material-symbols-outlined text-xl">
                                            {selectedWaste?.icon ?? "recycling"}
                                        </span>

                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase text-on-surface-variant">
                                            Type
                                        </p>

                                        <p className="font-bold text-on-surface">
                                            {wasteType === "Autre"
                                                ? wasteTypeOther || "Other"
                                                : selectedWaste?.title}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined text-xl">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase">Time Slot</p>
                                        <p className="text-sm text-on-surface-variant italic">
                                            {selectedTime
                                                ? selectedTime
                                                : "Not selected yet"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tertiary shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined text-xl">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase">Location</p>
                                        <p className="text-sm text-on-surface-variant italic">
                                            {tempLocation
                                                ? tempLocation
                                                : "Waiting for confirmation"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-outline-variant/20">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-on-surface-variant font-medium">Estimated Impact</span>
                                    <span className="text-primary font-bold">{selectedWaste?.impactLabel || "--"}</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${impactPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Support Card */}
                        <div className="mt-6 bg-secondary text-on-secondary rounded-3xl p-6 flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl">help_center</span>
                            <div>
                                <p className="font-bold text-sm">Need help booking?</p>
                                <p className="text-xs opacity-80">Our curators are available 24/7 at phone 88888888</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

        </>
    );
}