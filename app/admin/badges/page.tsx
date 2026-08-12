"use client"

import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";
import { BadgeCriteria, User } from "@/types/api";
import { useEffect, useState } from "react";

export default function BadgesPage() {

    const [criteria, setCriteria] = useState<BadgeCriteria | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { toast } = useToast();

    const [editingBadge, setEditingBadge] = useState<
        "bee" | "saphir" | "malachite" | null
    >(null);

    const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);

    const [users, setUsers] = useState<User[]>([]);

    const [error, setError] = useState('');

    const [badgeStats, setBadgeStats] = useState({
        totalUnlocked: 0,
        beeUsers: 0,
        badgeParticipation: 0,
    });

    useEffect(() => {
        loadCriteria();
    }, []);

    const loadCriteria = async () => {
        try {
            setLoading(true);

            const data = await adminService.getBadgeCriteria();


            setCriteria(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!criteria) return;

        const fetchUsers = async () => {
            try {
                const data = await adminService.getAllUsers();

                const stats = calculateBadgeStats(data);

                setBadgeStats(stats);

            } catch (err) {
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

    }, [criteria]);

    const saveCriteria = async () => {
        if (!criteria) return;

        try {
            setSaving(true);

            const updated = await adminService.updateBadgeCriteria(criteria);

            setCriteria(updated);

            toast({
                title: "Success",
                description: "Badge criteria updated successfully!",
            });

        } catch (err) {
            console.error(err);

            toast({
                title: "Error",
                description: "Failed to update badge criteria.",
                variant: "destructive",
            });

        } finally {
            setSaving(false);
            loadCriteria()
        }
    };

    const updateCriteriaField = (
        field: keyof typeof criteria,
        value: number
    ) => {
        setCriteria((prev) => {
            if (!prev) return prev;

            const updated = {
                ...prev,
                [field]: value,
            };

            switch (field) {

                case "colibriBeeMax":
                    if (updated.colibriBeeMax >= updated.colibriSaphirMin) {
                        updated.colibriSaphirMin = updated.colibriBeeMax + 1;
                    }

                    if (updated.colibriSaphirMin >= updated.colibriSaphirMax) {
                        updated.colibriSaphirMax = updated.colibriSaphirMin + 1;
                    }

                    if (updated.colibriSaphirMax >= updated.colibriMalachiteMin) {
                        updated.colibriMalachiteMin = updated.colibriSaphirMax + 1;
                    }

                    break;


                case "colibriSaphirMin":
                    if (updated.colibriSaphirMin <= updated.colibriBeeMax) {
                        updated.colibriBeeMax = updated.colibriSaphirMin - 1;
                    }

                    if (updated.colibriSaphirMin >= updated.colibriSaphirMax) {
                        updated.colibriSaphirMax = updated.colibriSaphirMin + 1;
                    }

                    if (updated.colibriSaphirMax >= updated.colibriMalachiteMin) {
                        updated.colibriMalachiteMin = updated.colibriSaphirMax + 1;
                    }

                    break;


                case "colibriSaphirMax":
                    if (updated.colibriSaphirMax <= updated.colibriSaphirMin) {
                        updated.colibriSaphirMin = updated.colibriSaphirMax - 1;
                    }

                    if (updated.colibriSaphirMax >= updated.colibriMalachiteMin) {
                        updated.colibriMalachiteMin = updated.colibriSaphirMax + 1;
                    }
                    break;


                case "colibriMalachiteMin":
                    if (updated.colibriMalachiteMin <= updated.colibriSaphirMax) {
                        updated.colibriSaphirMax = updated.colibriMalachiteMin - 1;

                        if (updated.colibriSaphirMax <= updated.colibriSaphirMin) {
                            updated.colibriSaphirMin = updated.colibriSaphirMax - 1;
                        }
                    }
                    break;
            }

            return updated;
        });
    };

    const calculateBadgeStats = (users: User[]) => {
        let totalUnlocked = 0;
        let beeUsers = 0;
        let badgeActiveUsers = 0;


        users.forEach((user) => {

            if (user.points > 0) {
                badgeActiveUsers++;
            }


            // Colibri Bee unlocked
            if (user.points >= criteria.colibriBeeMax) {
                totalUnlocked++;
                beeUsers++;
            }


            // Colibri Saphir unlocked
            if (
                user.points >= criteria.colibriSaphirMin &&
                user.points <= criteria.colibriSaphirMax
            ) {
                totalUnlocked++;
            }


            // Colibri Malachite unlocked
            if (user.points >= criteria.colibriMalachiteMin) {
                totalUnlocked++;
            }

        });


        return {
            totalUnlocked,
            beeUsers,
            badgeParticipation:
                users.length > 0
                    ? Math.round(
                        (badgeActiveUsers / users.length) * 100
                    )
                    : 0,
        };
    };

    return (
        <div className="text-on-surface selection:bg-primary-container/30 flex">

            {/* Main Content */}
            <main className="min-h-screen flex flex-col">

                {/* Main Page Content */}
                <div className="p-10 space-y-10">
                    {/* Page Header Section */}
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-display-lg text-on-surface -tracking-[0.02em] font-bold">Badges Management</h2>
                            <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">Define user progression milestones
                                and environmental impact certifications based on participation points.</p>
                        </div>
                        <button
                            onClick={() => setIsCriteriaModalOpen(true)}
                            className="px-8 py-4 rounded-full bg-primary text-white font-bold"
                        >
                            Edit Badge Criteria
                        </button>
                        {/*
                        <div className="flex gap-4">
                            <button
                                className="biophilic-gradient text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                <span className="material-symbols-outlined">add</span>
                                Create New Badge
                            </button>
                        </div>
                        */}
                    </section>
                    {/* Stats & Context (Asymmetric Tonal Grid) */}
                    <section className="grid grid-cols-12 gap-6">
                        <div
                            className="col-span-12 lg:col-span-8 bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="text-label-md font-bold text-primary tracking-widest uppercase mb-4">Impact Spotlight
                                </p>
                                <h3 className="text-headline-lg font-bold text-on-surface leading-tight max-w-md mb-8"> Our community has unlocked {badgeStats.totalUnlocked} badges across the ecosystem.</h3>
                                <div className="flex items-center gap-12">
                                    <div>
                                        <p className="text-display-lg font-extrabold text-on-surface">
                                            {badgeStats.badgeParticipation}%
                                        </p>

                                        <p className="text-label-md font-medium text-on-surface-variant">
                                            Badge Participation
                                        </p>
                                    </div>
                                    <div className="h-12 w-[1px] bg-outline-variant/30"></div>
                                    <div>
                                        <p className="text-display-lg font-extrabold text-secondary">
                                            {badgeStats.beeUsers}
                                        </p>

                                        <p className="text-label-md font-medium text-on-surface-variant">
                                            New Colibri Bees
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract Shape Overlay */}
                            <div
                                className="absolute right-0 bottom-0 top-0 w-1/3 bg-primary/5 -rotate-12 translate-x-1/2 translate-y-1/4 rounded-full blur-3xl pointer-events-none">
                            </div>
                        </div>
                        <div
                            className="col-span-12 lg:col-span-4 bg-secondary text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-secondary/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-4xl mb-4">auto_awesome</span>
                                <p className="text-headline-md font-bold mb-2">Automated Tiering</p>
                                <p className="text-body-lg opacity-80 leading-relaxed">System automatically assigns badges as soon
                                    as point thresholds are met. No manual intervention required.</p>
                            </div>
                            <a
                                className="relative z-10 flex items-center gap-2 font-bold hover:underline underline-offset-4 mt-8"
                                href="#badge-collection"
                            >
                                View point logs
                                <span className="material-symbols-outlined">arrow_right_alt</span>
                            </a>
                        </div>
                    </section>
                    {/* Badge Grid Management */}
                    <section className="space-y-6" id="badge-collection">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="text-headline-md font-bold text-on-surface">Active Badge Collection</h4>
                            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                                <span className="text-label-md font-bold text-on-surface-variant">Filter by Rank:</span>
                                <select
                                    className="bg-transparent border-none text-label-md font-bold text-primary focus:ring-0 cursor-pointer">
                                    <option>All Ranks</option>
                                    <option>Colibris Bee</option>
                                    <option>Colibris Malachite</option>
                                    <option>Colibris Saphire</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Badge Card 1 */}
                            <div
                                className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden border-none flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div
                                        className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary transform group-hover:rotate-6 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-4xl" data-weight="fill"
                                            style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className="text-label-md font-bold bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full">Common</span>
                                        <p
                                            className="text-[10px] uppercase font-black tracking-tighter text-on-surface-variant/40 mt-1">
                                            Tier 01</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-headline-md font-bold text-on-surface mb-1">Colibris Bee</h5>
                                    <p className="text-body-lg text-on-surface-variant/70 leading-relaxed">The first step into our
                                        ecosystem. Rewarded for joining and completing the initial profile setup.</p>
                                </div>
                                <div className="mt-auto pt-6 border-t border-dashed border-outline-variant/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Points
                                            Threshold</span>
                                        <span className="text-headline-md font-bold text-primary">{criteria
                                            ? `0 - ${criteria.colibriBeeMax}`
                                            : "—"}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {/*<button
                                            onClick={() => setEditingBadge("bee")}
                                            className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-xl font-bold text-label-md hover:bg-surface-container-high transition-colors"
                                        >
                                            Edit Parameters
                                        </button>
                                        <button
                                            className="w-12 h-12 flex items-center justify-center bg-surface-container-low text-error/60 hover:text-error hover:bg-error-container/20 rounded-xl transition-all">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>*/}
                                    </div>
                                </div>
                            </div>
                            {/* Badge Card 2 */}
                            <div
                                className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden border-none flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div
                                        className="w-16 h-16 rounded-2xl bg-secondary-container/10 flex items-center justify-center text-secondary transform group-hover:rotate-6 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-4xl" data-weight="fill"
                                            style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className="text-label-md font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full">Intermediate</span>
                                        <p
                                            className="text-[10px] uppercase font-black tracking-tighter text-on-surface-variant/40 mt-1">
                                            Tier 02</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-headline-md font-bold text-on-surface mb-1">Colibris Saphir</h5>
                                    <p className="text-body-lg text-on-surface-variant/70 leading-relaxed">Dedicated community
                                        members who actively participate in monthly refill initiatives.</p>
                                </div>
                                <div className="mt-auto pt-6 border-t border-dashed border-outline-variant/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Points
                                            Threshold</span>
                                        <span className="text-headline-md font-bold text-primary"> {criteria
                                            ? `${criteria.colibriSaphirMin} - ${criteria.colibriSaphirMax}`
                                            : "—"}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {/*<button
                                            onClick={() => setEditingBadge("saphir")}
                                            className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-xl font-bold text-label-md hover:bg-surface-container-high transition-colors"
                                        >
                                            Edit Parameters
                                        </button>
                                        <button
                                            className="w-12 h-12 flex items-center justify-center bg-surface-container-low text-error/60 hover:text-error hover:bg-error-container/20 rounded-xl transition-all">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>*/}
                                    </div>
                                </div>
                            </div>
                            {/* Badge Card 3 */}
                            <div
                                className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden border-none flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div
                                        className="w-16 h-16 rounded-2xl bg-tertiary-container/10 flex items-center justify-center text-tertiary transform group-hover:rotate-6 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-4xl" data-weight="fill"
                                            style={{ fontVariationSettings: "'FILL' 1" }}>tsunami</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className="text-label-md font-bold bg-tertiary/10 text-tertiary px-3 py-1 rounded-full">Elite</span>
                                        <p
                                            className="text-[10px] uppercase font-black tracking-tighter text-on-surface-variant/40 mt-1">
                                            Tier 03</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-headline-md font-bold text-on-surface mb-1">Colibris Malachite</h5>
                                    <p className="text-body-lg text-on-surface-variant/70 leading-relaxed">Awarded to contributors
                                        who suggest and lead new ecological projects within their region.</p>
                                </div>
                                <div className="mt-auto pt-6 border-t border-dashed border-outline-variant/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Points
                                            Threshold</span>
                                        <span className="text-headline-md font-bold text-primary"> {criteria
                                            ? `${criteria.colibriMalachiteMin}+`
                                            : "—"}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {/*<button
                                            onClick={() => setEditingBadge("malachite")}
                                            className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-xl font-bold text-label-md hover:bg-surface-container-high transition-colors"
                                        >
                                            Edit Parameters
                                        </button>
                                        <button
                                            className="w-12 h-12 flex items-center justify-center bg-surface-container-low text-error/60 hover:text-error hover:bg-error-container/20 rounded-xl transition-all">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>*/}
                                    </div>
                                </div>
                            </div>
                            {/* Badge Card 4 (Legendary/Ghost state)
                            <div
                                className="group bg-surface-container-low/50 p-8 rounded-[2rem] border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-4 text-center hover:bg-surface-container-low transition-all duration-300">
                                <div
                                    className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/30">
                                    <span className="material-symbols-outlined text-5xl">military_tech</span>
                                </div>
                                <div>
                                    <h5 className="text-headline-md font-bold text-on-surface-variant opacity-40">Legendary Tier
                                    </h5>
                                    <p className="text-body-lg text-on-surface-variant/40 px-6">Reserved for the top 1% of impact
                                        contributors.</p>
                                </div>
                                <button className="mt-4 text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                    Configure Milestone
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                             */}
                        </div>
                    </section>
                    {/* Bottom Asymmetric Content (Editorial Detail) */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                        <div className="space-y-6">
                            <h4 className="text-headline-md font-bold text-on-surface">Badge Visual Identity</h4>
                            <p className="text-body-lg text-on-surface-variant">All badges follow the Biophilic Design language.
                                Ensure new icons use the <span
                                    className="bg-primary-container/20 text-primary-container px-2 py-0.5 rounded font-mono text-sm">Material
                                    Symbols</span> library with a <span
                                        className="bg-primary-container/20 text-primary-container px-2 py-0.5 rounded font-mono text-sm">Weight:
                                    400</span> and <span
                                        className="bg-primary-container/20 text-primary-container px-2 py-0.5 rounded font-mono text-sm">Fill:
                                    1</span> for active states.</p>
                            <div className="flex flex-wrap gap-4">
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant/40">
                                    <span className="material-symbols-outlined">nature_people</span></div>
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant/40">
                                    <span className="material-symbols-outlined">energy_savings_leaf</span></div>
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant/40">
                                    <span className="material-symbols-outlined">rainy</span></div>
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant/40">
                                    <span className="material-symbols-outlined">compost</span></div>
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant/40">
                                    <span className="material-symbols-outlined">recycling</span></div>
                            </div>
                        </div>
                        <div className="rounded-3xl overflow-hidden shadow-2xl relative group h-80">
                            <img alt="Environmental Impact Background"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                data-alt="A lush, vibrant macro shot of a green leaf with morning dew drops catching sunlight, creating beautiful natural bokeh. The lighting is high-key, emphasizing fresh, biophilic greens and soft, airy textures. The scene evokes a sense of pristine environmental health and the core values of the Colibris ecosystem. The overall mood is serene and hopeful."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5gCHWdVGtIbJauXLNEXoa51aGTCLjL5GBP9erQm99hPTHJETvz2gOMDTYYxvGkj650TYzilS3rwPNgue8YNXYH_1qnad6i71q0OWH3L44qnwsX2mg_SVKEicnQPr8Kdwhu1kms7uCiA5WBnPz4zJvCLEd_3rb9Pmr6iFImxl88IW5IbO0pd6NwQ_QGGxk7CNheZzDddSNaQHAArkQdhDKpNEVb14rogmaAPhQSgR95Dk6yi7xAY2L4CUU_BeiwkRwaYuPXLJV0Uqn" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Our Mission</p>
                                <h5 className="text-white text-headline-md font-bold">Turning small actions into legendary impact.
                                </h5>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {isCriteriaModalOpen && criteria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-surface p-8 shadow-2xl">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Edit Badge Criteria
                            </h2>

                            <p className="mt-2 text-on-surface-variant">
                                Configure the point ranges for each badge tier.
                            </p>
                        </div>

                        <div className="space-y-6">

                            {/* Bee */}
                            <div>
                                <label className="block mb-2 font-semibold">
                                    Colibris Bee Maximum Points
                                </label>

                                <input
                                    type="number"
                                    min={0}
                                    value={criteria.colibriBeeMax}
                                    onChange={(e) =>
                                        updateCriteriaField(
                                            "colibriBeeMax",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3"
                                />
                            </div>

                            {/* Saphir */}
                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-2 font-semibold">
                                        Saphir Minimum
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={criteria.colibriSaphirMin}
                                        onChange={(e) =>
                                            updateCriteriaField(
                                                "colibriSaphirMin",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">
                                        Saphir Maximum
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={criteria.colibriSaphirMax}
                                        onChange={(e) =>
                                            updateCriteriaField(
                                                "colibriSaphirMax",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3"
                                    />
                                </div>

                            </div>

                            {/* Malachite */}
                            <div>
                                <label className="block mb-2 font-semibold">
                                    Malachite Minimum Points
                                </label>

                                <input
                                    type="number"
                                    min={0}
                                    value={criteria.colibriMalachiteMin}
                                    onChange={(e) =>
                                        updateCriteriaField(
                                            "colibriMalachiteMin",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3"
                                />
                            </div>

                        </div>

                        <div className="mt-10 flex justify-end gap-3">

                            <button
                                onClick={async () => {
                                    setIsCriteriaModalOpen(false);
                                    await loadCriteria();
                                }}
                                className="rounded-full border border-outline px-6 py-3 font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await saveCriteria();
                                    setIsCriteriaModalOpen(false);
                                }}
                                disabled={saving}
                                className="rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}