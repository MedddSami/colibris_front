"use client"

import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";

export default function RecyclingGuide() {
    const [filter, setFilter] = useState("all");

    const filters = [
        {
            id: "all",
            label: "All Items",
            icon: null,
        },
        {
            id: "plastics",
            label: "Plastics",
            icon: "recycling",
        },
        {
            id: "metals",
            label: "Metals",
            icon: "precision_manufacturing",
        },
        {
            id: "paper",
            label: "Paper",
            icon: "description",
        },
        {
            id: "glass",
            label: "Glass",
            icon: "wine_bar",
        },
    ];

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
                {/* HERO */}

                <header className="mb-16 text-center md:text-left">
                    <h1 className="mb-6 text-[3.5rem] font-bold leading-[1.1] tracking-tight text-primary">
                        What Can Be <br />
                        <span className="text-secondary">Recycled?</span>
                    </h1>

                    <p className="max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
                        Navigating circularity shouldn't be a guessing game. Use our premium
                        guide to master your local recycling stream and minimize your
                        ecological footprint.
                    </p>
                </header>

                {/* FILTERS */}

                <div className="mb-12 flex flex-wrap gap-3">
                    {filters.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={`flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-all duration-300 ${filter === item.id
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                                }`}
                        >
                            {item.icon && (
                                <span className="material-symbols-outlined text-[20px]">
                                    {item.icon}
                                </span>
                            )}

                            {item.label}
                        </button>
                    ))}
                </div>

                {/* GRID */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

                    {(filter === "all" || filter === "plastics") && (
                        <div className="bento-card group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest md:col-span-8 md:flex-row">
                            <div className="relative h-64 overflow-hidden md:h-auto md:w-1/2">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLgWMbDTwWN2jK3RHnGCSpKqFsaj_73yZgdCPRwTvb9COd94WyC1ZnvBmJn7M848NZFxgEMd3-wjJ-OsFvubgwIlAkz-_6tjnfNG5dZO-bYpNn94Z9TqPSBBqarCg9gJxaYaMDuJf2od4_NHoIiXQQljBn0aDHfidxmygLy9JzJSuILg0twmDd3bsL2LzOMjFiLvRJj4ciXTSL6Wmy-dnYGOuvP6lrg69WkU_xBGTGve5CijQsfz5uVA"
                                    alt="Plastic bottles"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-primary/5"></div>

                                <img
                                    src="https://lh3.googleusercontent.com/aida/AP1WRLs_-Tt25oCzFdjSHrVrtifiaaeqqUcfVaRN937gKBvgiwutHJR2dD5BNax40x71UGH0GZMNEzPHtunjjMC4Ujmbx483au7-BVy3EnnVT1OFaTa6NjbY3vayY2Jz89lRhgTg7mNYOVLj5m6Axir9Vh_35P6nz2hcI74v4r0JaK8kaZVZlY22b64bXw3LlJ5JV8umb92lASp7QOTir4pq9mTuRWU3vfDe5d2jKWM4nP8onmSha4jKvspMBPXT5GGe-4sngK6Zd2PAcQ"
                                    alt="Colibris Icon"
                                    className="absolute top-6 left-6 h-12 w-12 mix-blend-multiply opacity-80"
                                />
                            </div>

                            <div className="flex flex-col justify-between p-8 md:w-1/2">
                                <div>
                                    <div className="mb-4 flex items-center gap-2 text-primary">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontVariationSettings: "'FILL' 1",
                                            }}
                                        >
                                            water_drop
                                        </span>

                                        <span className="text-label-md font-bold uppercase tracking-widest">
                                            Plastics (Type 1,2,5)
                                        </span>
                                    </div>

                                    <h3 className="mb-4 text-[1.75rem] font-bold leading-tight text-on-surface">
                                        Rigid Containers
                                    </h3>

                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-primary">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    check_circle
                                                </span>
                                                <span className="text-label-md">
                                                    Water Bottles
                                                </span>
                                            </li>

                                            <li className="flex items-start gap-2 text-primary">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    check_circle
                                                </span>
                                                <span className="text-label-md">
                                                    Soda Plastic Bottles
                                                </span>
                                            </li>
                                        </ul>

                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-error">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    cancel
                                                </span>
                                                <span className="text-label-md">
                                                    Plastic Bags
                                                </span>
                                            </li>

                                            <li className="flex items-start gap-2 text-error">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    cancel
                                                </span>
                                                <span className="text-label-md">
                                                    Styrofoam
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-surface-container-low p-4">
                                    <p className="text-label-md italic font-medium text-on-surface-variant">
                                        "If it holds its shape when squeezed, it's likely accepted."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {(filter === "all" || filter === "metals") && (
                        <div className="bento-card flex flex-col justify-between rounded-xl bg-secondary p-8 text-on-primary md:col-span-4">
                            <div>
                                <span className="material-symbols-outlined mb-6 text-[48px]">
                                    inventory_2
                                </span>

                                <h3 className="mb-4 text-[1.375rem] font-bold">
                                    Metals & Cans
                                </h3>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container">
                                            <span className="material-symbols-outlined text-[16px] text-on-secondary-container">
                                                check
                                            </span>
                                        </div>

                                        <span>Aluminum Soda Cans</span>
                                    </li>

                                    <li className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container">
                                            <span className="material-symbols-outlined text-[16px] text-on-secondary-container">
                                                check
                                            </span>
                                        </div>

                                        <span>Steel Food Tins</span>
                                    </li>

                                    <li className="flex items-center gap-3 opacity-60">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error-container">
                                            <span className="material-symbols-outlined text-[16px] text-on-error-container">
                                                close
                                            </span>
                                        </div>

                                        <span>Aerosol Spray Cans</span>
                                    </li>
                                </ul>
                            </div>

                            {/*<button className="mt-8 text-label-md font-bold underline decoration-2 underline-offset-4 transition hover:text-secondary-fixed">
                                Details
                            </button>*/}
                        </div>
                    )}
                    {(filter === "all" || filter === "paper") && (
                        <div className="bento-card rounded-xl bg-surface-container-high p-8 md:col-span-6">
                            <div className="mb-8 flex items-start justify-between">
                                <h3 className="text-[1.75rem] font-bold text-on-surface">
                                    Paper & Cardboard
                                </h3>

                                <span className="material-symbols-outlined text-[32px] text-primary">
                                    newspaper
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
                                    <span className="material-symbols-outlined text-primary">
                                        task_alt
                                    </span>

                                    <div>
                                        <p className="font-bold">Accepted</p>

                                        <p className="text-label-md text-on-surface-variant">
                                            Flattened boxes, office paper, envelopes, and clean
                                            newspapers.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
                                    <span className="material-symbols-outlined text-error">
                                        dangerous
                                    </span>

                                    <div>
                                        <p className="font-bold">Avoid</p>

                                        <p className="text-label-md text-on-surface-variant">
                                            Greasy pizza boxes, wet paper, and laminated gift wrap.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(filter === "all" || filter === "glass") && (
                        <div className="bento-card overflow-hidden rounded-xl bg-primary-container text-on-primary-container md:col-span-6">
                            <div className="flex h-full flex-col md:flex-row">
                                <div className="p-8 md:w-3/5">
                                    <h3 className="mb-4 text-[1.75rem] font-bold">
                                        Glass Jars
                                    </h3>

                                    <p className="mb-6 text-body-md opacity-90">
                                        All colors of glass are accepted, including clear, green,
                                        and amber.
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-on-primary-container/10 px-3 py-1 text-label-md font-bold">
                                            <span className="material-symbols-outlined text-[16px]">
                                                check
                                            </span>
                                            Food Jars
                                        </span>

                                        <span className="inline-flex items-center gap-2 rounded-full bg-on-primary-container/10 px-3 py-1 text-label-md font-bold">
                                            <span className="material-symbols-outlined text-[16px]">
                                                check
                                            </span>
                                            Beverage Bottles
                                        </span>

                                        <span className="inline-flex items-center gap-2 rounded-full bg-error-container/20 px-3 py-1 text-label-md font-bold text-on-error-container">
                                            <span className="material-symbols-outlined text-[16px]">
                                                close
                                            </span>
                                            Ceramics & Pyrex
                                        </span>
                                    </div>
                                </div>

                                <div className="h-48 md:h-auto md:w-2/5">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0-eFbHTj2Jb3nul5PUAJBmx9KwUEdZjVV42crtBPfOl051afr-T1wzNSua0LJtXrj8ZJDtuErwHGJx6r0KMmdGs2lHFhiulrPybIp36-tWXviy5K46sUof1wKN-Jl0QT4T-HUi5BTYxpWuQUxfo2bwwNYsGrBRutcpQQSZG4S7P9Y38JZsXaPJTQvqewxkrH2WwUoJiTIIWMEPy6Y27MiMZ-FrzyEicbhyr6Hyf-9ekeytTTJcKl6mw"
                                        alt="Glass Bottles"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* COLLECTION PREP */}

                <section className="mt-24">
                    <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-8 md:p-16">
                        <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">

                            <div>
                                <h2 className="mb-6 text-[2rem] font-bold leading-tight text-primary">
                                    Collection Day Prep
                                </h2>

                                <p className="mb-8 leading-relaxed text-on-surface-variant">
                                    To ensure your items actually get recycled, follow our simple
                                    "Triple-C" preparation protocol. Contaminated items are the
                                    leading cause of batch rejections.
                                </p>

                                <div className="space-y-8">

                                    <div className="flex gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-on-primary">
                                            1
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold">
                                                Clean
                                            </h4>

                                            <p className="text-label-md text-on-surface-variant">
                                                Rinse all food and liquid containers. A quick swish of
                                                water is usually enough to remove residues.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-on-primary">
                                            2
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold">
                                                Clear
                                            </h4>

                                            <p className="text-label-md text-on-surface-variant">
                                                Remove lids and plastic pumps. Lids are often made of
                                                different materials that require separate recycling
                                                streams.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-on-primary">
                                            3
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold">
                                                Collapse
                                            </h4>

                                            <p className="text-label-md text-on-surface-variant">
                                                Flatten cardboard boxes to save space and prevent sorting
                                                jams.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="relative">

                                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 border-primary-container/20 bg-surface-container-lowest p-4">

                                    <div className="relative h-full w-full overflow-hidden rounded-full">

                                        <img
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8BLKRtfYrcjadeQi1pHZ0RTBkwMQgcfHMz5-uxiLPR5hjMUewI4tWjOV5rzYBL6S2mYhVpA1XtxBiLA4K4rq68sRM7eIwTOO0yRw5C4bM2N4544ES9oDDunZ9CSbNexP4hRT5WT0rKGI4JYItCObFCpNTJuYRy9f7I7X-9AAYqWIwcLYJTs7yUkVLWfgm7saqCUOuu_5L_3nvfI1Q4JgttTzM28n5D-ceSqFr_Fsk0fu4ZV0aSgtuPw"
                                            alt="Organized recycling bin"
                                            className="h-full w-full object-cover"
                                        />

                                        <div className="absolute bottom-12 left-1/2 w-48 -translate-x-1/2 rounded-lg border border-white/40 bg-white/60 p-3 backdrop-blur-sm">

                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd95stFAekvuj8speCse6UDp07WY-DT_gFjs2ckbHpgqK0Y6BiCtwkz1hoV6cr8h0WNQL4u67fqHVLqlkyjN6aq12tIFpLb0txjpvRQAhXGjBpE2SG4Bd0okRoMCOy5wP425xboOKMwl7wmlFxuxJAptHq2pBSj-uGrLDuhbslA8IuYnVQnf_qdtayKrcIbeFCbXygV0xelLolMCyFZFj4-DVq-5s1iU0Q6kfxpxYJrSgH_-w5jQYDB3Jd2vXH13yF8BA"
                                                alt="Colibris Logo"
                                                className="h-auto w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Impact Ring */}

                                    <div className="absolute -right-4 -bottom-4 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
                                        <div
                                            className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-tertiary"
                                            style={{
                                                animationDuration: "4s",
                                            }}
                                        ></div>

                                        <div>
                                            <p className="text-[1.375rem] font-bold text-primary">
                                                84%
                                            </p>

                                            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant">
                                                Purity Rating
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}