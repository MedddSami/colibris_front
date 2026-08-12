// app/dashboard/bookings/components/BookingSummary.tsx

export default function BookingSummary() {
    return (
        <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-8">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
                        Your Collection
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                        Summary of your eco-impact request.
                    </p>
                </div>

                {/* TYPE */}
                <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        🌿
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                            Type
                        </p>
                        <p className="font-bold">Organic Waste</p>
                    </div>
                </div>

                {/* TIME */}
                <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        ⏱
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                            Time Slot
                        </p>
                        <p className="text-sm text-slate-400 italic">
                            Not selected yet
                        </p>
                    </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        📍
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                            Location
                        </p>
                        <p className="text-sm text-slate-400 italic">
                            Waiting for confirmation
                        </p>
                    </div>
                </div>

                {/* IMPACT */}
                <div className="pt-6 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Estimated Impact</span>
                        <span className="text-primary font-bold">12.4 kg CO₂e</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full mt-3">
                        <div className="h-full bg-primary w-[35%] rounded-full" />
                    </div>
                </div>
            </div>

            {/* HELP */}
            <div className="bg-emerald-700 text-white rounded-3xl p-6 flex items-center gap-4">
                <span className="text-2xl">❓</span>
                <div>
                    <p className="font-bold text-sm">Need help booking?</p>
                    <p className="text-xs opacity-80">
                        Our curators are available 24/7
                    </p>
                </div>
            </div>
        </aside>
    );
}