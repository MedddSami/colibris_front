
export default function BookingStepper({ step }: { step: 1 | 2 | 3 }) {
    const steps = [
        { id: 1, label: "Waste Type" },
        { id: 2, label: "Schedule" },
        { id: 3, label: "Details" },
    ];

    return (
        <nav className="hidden md:flex items-center gap-8">
            {steps.map((s, index) => {
                const active = step === s.id;

                return (
                    <div key={s.id} className="flex items-center gap-3">
                        <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-primary text-white" : "bg-surface-container-high text-slate-600"
                                }`}
                        >
                            {s.id}
                        </span>

                        <span
                            className={`text-sm ${active
                                    ? "font-bold text-emerald-900"
                                    : "text-on-surface-variant"
                                }`}
                        >
                            {s.label}
                        </span>

                        {index < steps.length - 1 && (
                            <div className="w-12 h-px bg-outline-variant/30" />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}