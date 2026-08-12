"use client";

import { userService } from "@/services/userService";
import { Action, User } from "@/types/api";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DonateActionModal from "@/components/modals/admin/Actions/DonateActionModal";
import { authService } from "@/services/authService";


export default function ImpactDashboard() {
    const { toast } = useToast();

    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);

    const [donateOpen, setDonateOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const [donatePoints, setDonatePoints] = useState(10);
    const [loadingDonate, setLoadingDonate] = useState(false);
    const [donateModalOpen, setDonateModalOpen] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    const [didDonate, setDidDonate] = useState(false);

    const fetchActions = async () => {
        try {
            setLoading(true);

            const data = await userService.getAvailableActions();

            setActions(data.actions);
        } catch (err) {
            console.error(err);

            toast({
                variant: "destructive",
                title: "Error",
                description: "Unable to load initiatives.",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const profile = await authService.getProfile();
            setUser(profile);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                await Promise.all([
                    fetchActions(),
                    fetchUser(),
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getDaysLeft = (deadline: string) => {
        const diff =
            new Date(deadline).getTime() - new Date().getTime();

        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const openDonateModal = (action: Action) => {
        setDidDonate(false);
        setSelectedAction(action);
        setDonateModalOpen(true);
    };

    const handleCloseDonateModal = async () => {
        setDonateModalOpen(false);
        setSelectedAction(null);

        if (!didDonate) {
            await Promise.all([
                fetchActions(),
                fetchUser(),
            ]);
        }
    };

    const handleDonate = async (points: number) => {
        if (!selectedAction) return;

        try {
            setDonating(true);
            await userService.donateToAction(
                selectedAction._id,
                points
            );

            toast({
                title: "Donation successful",
                description: `You donated ${points} points to "${selectedAction.title}".`,
            });

            //
            setDidDonate(true);

            await Promise.all([
                fetchActions(),
                fetchUser(),
            ]);

            setDonateModalOpen(false);
            setSelectedAction(null);
            //fetchUser(); // or fetchData() if you already reload the user
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Donation failed",
                description:
                    error.response?.data?.message ??
                    "Unable to donate points.",
            });

        } finally {
            setDonating(false);
        }
    };

    const ACTIONS_PER_PAGE = 2;

    const [currentActionsPage, setCurrentActionsPage] = useState(0);

    const totalPages = Math.ceil(actions.length / ACTIONS_PER_PAGE);

    const visibleActions = useMemo(() => {
        const start = currentActionsPage * ACTIONS_PER_PAGE;

        return actions.slice(start, start + ACTIONS_PER_PAGE);
    }, [actions, currentActionsPage]);

    const featuredAction = actions[0];

    return (
        <div className="space-y-12 p-6 md:p-12">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 to-emerald-500 p-8 text-white md:p-16">
                <div className="flex flex-col items-start gap-10 md:flex-row md:items-center">
                    {/* LEFT */}
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                            <span className="material-symbols-outlined text-sm">
                                bolt
                            </span>

                            {featuredAction?.status === "active"
                                ? "Active Initiative"
                                : featuredAction?.status}
                        </div>

                        <h2 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
                            Your Actions Shape the Future.
                        </h2>

                        <p className="max-w-xl text-lg font-medium leading-relaxed opacity-90">
                            Join thousands of curators in restorative environmental projects.
                            Every point you donate directly funds certified global impact
                            targets.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="rounded-full bg-white px-8 py-4 text-lg font-extrabold text-emerald-700 shadow-xl transition-transform hover:scale-105 active:scale-95"
                                onClick={() =>
                                    document
                                        .getElementById("initiatives")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }>
                                Donate Points
                            </button>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="h-64 w-full overflow-hidden rounded-3xl shadow-2xl md:h-96 md:w-[420px]">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx2rdg0C_jKl0cXwebQZG6ibOj13HXJYyc969A5eBYwzMKaOXfdjowttrLZLgAq-mcB9CluJhT-C2twMn5AaevlcYEPI9dWJGDNLd26K-8IduHCo9OwOgL4q145a_rHCalW3Ay3Zg3LK04gco5hKmv1u7OaYF1tt0dlntPQJk96ZlrL4CawTTkpgmuXYRsfN1sLv1cOp1z2mwWJw1_-rgMZJfiwkpSnfRqoBCeC4PyY5HJ2NI7WaniYZyyMtxnHTsJPUaxjXL9K4A4"
                            alt="Environmental restoration"
                            width={600}
                            height={600}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                {/* BACKGROUND BLUR */}
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            </section>

            {/* INITIATIVES */}
            <section className="space-y-8" id="initiatives">
                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight text-emerald-900">
                            Current Initiatives
                        </h3>

                        <p className="font-medium text-slate-500">
                            Curated high-priority environmental goals for this quarter.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setCurrentActionsPage((p) =>
                                    Math.max(0, p - 1)
                                )
                            }
                            disabled={currentActionsPage === 0}
                        >
                            <span className="material-symbols-outlined">
                                chevron_left
                            </span>
                        </button>

                        <span>
                            {currentActionsPage + 1} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentActionsPage((p) =>
                                    Math.min(totalPages - 1, p + 1)
                                )
                            }
                            disabled={currentActionsPage === totalPages - 1}
                        >
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>

                    </div>
                </div>

                {/* GRID */}
                {actions.length === 0 ? (
                    <div className="md:col-span-12 flex flex-col items-center justify-center rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-12 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <span className="material-symbols-outlined text-3xl">
                                eco
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-on-surface mb-2">
                            No Actions Available
                        </h3>

                        <p className="max-w-md text-sm text-on-surface-variant">
                            There are currently no environmental actions available.
                            Check back soon and discover new ways to contribute to the
                            Colibris ecosystem.
                        </p>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-fr">

                        {actions.map((action, index) => {
                            const largeFirst = currentActionsPage % 2 === 0;

                            const isLarge =
                                largeFirst
                                    ? index === 0
                                    : index === 1;

                            const progress =
                                action.targetPoints > 0
                                    ? Math.round(
                                        (action.currentPoints / action.targetPoints) * 100
                                    )
                                    : 0;

                            const daysLeft = getDaysLeft(action.deadline);

                            /* =========================
                               EVEN INDEX → CLEAN BEACH CARD
                            ========================== */
                            if (!isLarge) {
                                return (
                                    <div
                                        key={action._id}
                                        className="md:col-span-4 rounded-3xl border border-sky-100 bg-sky-50 p-6 shadow-sm"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
                                                <span className="material-symbols-outlined text-sm">
                                                    eco
                                                </span>
                                            </div>

                                            <h4 className="text-sm font-bold text-sky-700">
                                                {action.title}
                                            </h4>
                                        </div>

                                        <p className="text-sm text-slate-500">
                                            {action.description}
                                        </p>

                                        {/* PROGRESS */}
                                        <div className="mt-4 h-2 w-full rounded-full bg-sky-100">
                                            <div
                                                className="h-full rounded-full bg-sky-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-bold text-sky-700">
                                                {progress}% funded
                                            </span>

                                            <button
                                                onClick={() => openDonateModal(action)}
                                                className="rounded-full p-2 text-sky-700 hover:bg-sky-100"
                                            >
                                                <span className="material-symbols-outlined">
                                                    add_circle
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            /* =========================
                               ODD INDEX → DETAILED CARD
                            ========================== */
                            return (
                                <div
                                    key={action._id}
                                    className="md:col-span-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                                >
                                    <div className="flex flex-col gap-8 md:flex-row">

                                        {/* IMAGE */}
                                        <div className="h-64 w-full overflow-hidden rounded-2xl md:w-1/2">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${action.image}` || "/placeholder.jpg"}
                                                alt={action.title}
                                                width={600}
                                                height={400}
                                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                            />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex flex-1 flex-col space-y-4">

                                            {/* HEADER */}
                                            <div className="flex items-start justify-between">
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                                    Priority: High
                                                </span>

                                                <div className="flex items-center text-sm font-bold text-red-500">
                                                    <span className="material-symbols-outlined mr-1 text-sm">
                                                        timer
                                                    </span>
                                                    {daysLeft} days left
                                                </div>
                                            </div>

                                            <h4 className="text-2xl font-bold text-emerald-900">
                                                {action.title}
                                            </h4>

                                            <p className="leading-relaxed text-slate-500">
                                                {action.description}
                                            </p>

                                            {/* PROGRESS */}
                                            <div className="space-y-2 pt-2">
                                                <div className="flex justify-between text-sm font-bold">
                                                    <span className="text-primary">
                                                        {progress}% Completed
                                                    </span>

                                                    <span className="text-slate-400">
                                                        {action.currentPoints} /{" "}
                                                        {action.targetPoints}
                                                    </span>
                                                </div>

                                                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <button
                                                onClick={() => openDonateModal(action)}
                                                className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    add
                                                </span>
                                                Contribute with Points
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* QUOTE */}
            <section className="mx-auto max-w-2xl space-y-6 py-12 text-center" >
                <span className="material-symbols-outlined text-5xl text-primary opacity-20">
                    format_quote
                </span>

                <p className="text-2xl italic leading-snug tracking-tight text-emerald-900/80 md:text-3xl">
                    "The greatest threat to our planet is the belief that someone else
                    will save it."
                </p>

                <div className="pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-900">
                        — Robert Swan
                    </p>
                </div>
            </section >

            <DonateActionModal
                open={donateModalOpen}
                action={selectedAction}
                userPoints={user?.points ?? 0}
                loading={donating}
                onClose={handleCloseDonateModal}
                onDonate={handleDonate}
            />
        </div >
    );
}