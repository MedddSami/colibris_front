"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProcessPage() {

    const router = useRouter();
    const { toast } = useToast();

    const { user, isAuthenticated, isInitialized } = useAppSelector(
        (state: RootState) => state.auth
    );

    const handleGetStarted = () => {
        if (
            isAuthenticated &&
            user &&
            (user.role === "particulier" || user.role === "entreprise")
        ) {
            toast({
                title: "Welcome back!",
                description: "Access your dashboard to book your next collection.",
            });

            router.push("/dashboard/bookings");
            return;
        }

        toast({
            title: "Sign in required",
            description: "Access your account to start booking collections and managing your impact.",
        });

        router.push("/auth/signin");
    };

    const handleLearnMore = () => {
        document.getElementById("process")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const handleSchedulePickup = () => {
        if (
            isAuthenticated &&
            user &&
            (user.role === "particulier" || user.role === "entreprise")
        ) {
            router.push("/dashboard/bookings");
        } else {
            router.push("/auth/signin");
        }
    };

    return (
        <>
            <Navbar />
            <main className="pt-24">
                {/* ================= HERO ================= */}

                <section className="relative mx-auto max-w-7xl overflow-hidden px-8 py-20">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="z-10">
                            <span className="mb-4 block text-label-md font-bold uppercase tracking-widest text-primary">
                                The Circular Journey
                            </span>

                            <h1 className="mb-6 text-display-lg text-primary">
                                Our Step-by-Step Recycling Process
                            </h1>

                            <p className="mb-8 max-w-lg text-body-lg text-on-surface-variant">
                                Experience a frictionless transition to a zero-waste lifestyle.
                                We've refined the recycling lifecycle into a premium service that
                                honors both your time and the planet.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleGetStarted}
                                    className="rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                                >
                                    Get Started
                                </button>

                                <button
                                    onClick={handleLearnMore}
                                    className="rounded-xl border border-outline-variant px-8 py-4 font-bold text-primary transition-colors hover:bg-surface-container-low"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="asymmetric-image-container h-[500px] w-full overflow-hidden rounded-3xl bg-surface-container-high">
                                <img
                                    src="recycle-symbol.jpg"
                                    alt="Recycling Process"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="animate-bounce-slow absolute -bottom-6 -left-6 max-w-xs rounded-2xl bg-surface-container-lowest p-8 shadow-xl">
                                <div className="mb-2 flex items-center gap-4">
                                    <span className="material-symbols-outlined text-3xl text-primary">
                                        eco
                                    </span>

                                    <div className="text-title-lg text-primary">
                                        100% Circular
                                    </div>
                                </div>

                                <p className="text-label-md text-on-surface-variant">
                                    Every item we collect is tracked and transformed into
                                    high-value raw materials.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= PROCESS ================= */}

                <section id="process" className="bg-surface-container-low py-24">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="mb-20 text-center">
                            <h2 className="mb-4 text-headline-lg text-primary">
                                A Seamless Evolution
                            </h2>

                            <p className="mx-auto max-w-2xl text-body-lg text-on-surface-variant">
                                From your doorstep to a second life—follow the path of your
                                recycled goods through our biophilic ecosystem.
                            </p>
                        </div>

                        {/* ROW ONE */}

                        <div className="mb-16 grid gap-8 md:grid-cols-12">

                            {/* STEP 1 */}

                            <div className="group opacity-100 transition-all duration-1000 md:col-span-7">
                                <div className="flex flex-col gap-8 rounded-3xl bg-surface-container-lowest p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:flex-row">

                                    <div className="biophilic-gradient flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-on-primary shadow-lg shadow-primary/20">
                                        01
                                    </div>

                                    <div>
                                        <h3 className="mb-3 text-title-lg text-primary">
                                            Schedule a Pickup
                                        </h3>

                                        <p className="mb-6 text-body-lg text-on-surface-variant">
                                            Initiate your contribution directly from our intuitive
                                            dashboard. Select your preferred time window and specify
                                            the volume of materials for a tailored collection
                                            experience.
                                        </p>

                                        <div className="h-48 w-full overflow-hidden rounded-xl bg-surface-container">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMn6_0rQaeMcDBrHtlRv1UaxihBnzz-8qbTtVM7jWrirZM_Xxatw7IlslL3OZQc5Ff66r-_2jKrQgcEfnRk0_bvHbIdhk1kKFixittW8dRG80K9Dksyt8vkztTpkgcYM6OEGzrl6-XQ9wGVkwf3LRtT6kETIH-258SKQgdQZHgb1aHaTJD9uXFuiLJIM6laV-ld_anOwN_AUToDeWumqy1tRSoeqkCJlsXiz6zo0lONffA7fBUVJWZsQ"
                                                alt="Scheduling"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 2 */}

                            <div className="md:col-span-5">
                                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-10 text-on-primary">

                                    <div className="relative z-10">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-on-primary/20 backdrop-blur-md">
                                            <span className="material-symbols-outlined">
                                                filter_alt
                                            </span>
                                        </div>

                                        <h3 className="mb-4 text-title-lg">
                                            Step 02: Smart Sorting
                                        </h3>

                                        <p className="mb-6 leading-relaxed opacity-90">
                                            Preparation is key. Our guide helps you organize materials
                                            into smart categories, ensuring maximum recovery value and
                                            minimal contamination during the transformation process.
                                        </p>

                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-sm">
                                                    check_circle
                                                </span>
                                                Glass & Ceramics
                                            </li>

                                            <li className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-sm">
                                                    check_circle
                                                </span>
                                                High-Grade Plastics
                                            </li>

                                            <li className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-sm">
                                                    check_circle
                                                </span>
                                                Organic Textiles
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="absolute -right-[10%] -bottom-[20%] h-64 w-64 rounded-full bg-primary-container/30 blur-3xl"></div>
                                </div>
                            </div>

                        </div>
                        {/* ROW TWO */}

                        <div className="grid gap-8 md:grid-cols-12">

                            {/* STEP 3 */}

                            <div className="group opacity-100 transition-all duration-1000 md:col-span-5">
                                <div className="flex h-full flex-col gap-6 rounded-3xl bg-surface-container-high p-8">

                                    <div className="h-64 overflow-hidden rounded-2xl">
                                        <img
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdylP5ZfDS7WGOzmpzPb0kIyve2XmF3RgYhIW82Aj51u7WBD-08arn10m4oDPzNfNt44sj6W9hZ2Jl3caUAiIk0KECmrCwo1Pi_5DU_B8H1hCIHedB1UUPSkjZ3o0lu3nJI0H_U7B5k-NdxgSEpLURhzY9BvE7Zs9L89xvKI1sH9vKMDNJzJmDC3XQ71q3XQu_Gx77Kbc0fCHdbmibtFjKueq5kIfqOu85lVzzxZoQeDYOd8j-C2_XGFwKG7yCP5amvpM"
                                            alt="Electric recycling van"
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-3">
                                            <span className="text-label-md font-bold uppercase text-primary">
                                                Service
                                            </span>

                                            <div className="h-px flex-grow bg-outline-variant/30"></div>
                                        </div>

                                        <h3 className="mb-2 text-title-lg text-primary">
                                            Step 03: Eco-friendly Pickup
                                        </h3>

                                        <p className="text-on-surface-variant">
                                            Our specialized electric fleet arrives with white-glove
                                            precision. We handle the heavy lifting while transporting
                                            your recyclables using zero-emission logistics.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 4 */}

                            <div className="md:col-span-7">
                                <div className="group relative overflow-hidden rounded-3xl border border-primary/5 bg-surface-container-lowest p-10 shadow-sm transition-all duration-1000">

                                    <div className="flex flex-col items-center gap-10 md:flex-row">

                                        <div className="w-full space-y-4 md:w-1/2">

                                            <div className="inline-block rounded-full bg-primary/10 px-4 py-1 text-label-md font-bold text-primary">
                                                The Transformation
                                            </div>

                                            <h3 className="text-headline-md text-primary">
                                                04: Second-Life Transformation
                                            </h3>

                                            <p className="text-body-lg text-on-surface-variant">
                                                Witness the ultimate circular act. Your waste is
                                                processed using bio-industrial methods, transforming raw
                                                materials into premium architectural elements and
                                                beautifully designed products.
                                            </p>

                                            {/*<button className="flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-4">
                                                View Impact Report

                                                <span className="material-symbols-outlined">
                                                    arrow_forward
                                                </span>
                                            </button>*/}
                                        </div>

                                        <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl md:w-1/2">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI0Q9uc0gv9ZA3HO_cvgbfYgfgTcwZ96Hnlz9CRXELHK79BByKvSzCXB-os2PcYoJFVDv5aCuZOiEWMGEdGT9gjYpq15j44F17O17cvk8AsuULDyYUZJ0jbQGtnjcPUDd0QVnXTXO53hX6XM0Esr5WrEqqdRUIYd02_1KQUOk24Uka8fpRpI5Cj7w5nyzjjZcL1CjkONSUeo0DSohR8w5wzq0xVL6iCAGKXzBlj3J-3qaaEugp_xfyhA"
                                                alt="Recycled materials transformed"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* Join the Movement CTA */}
                <section className="py-24 px-8">
                    <div
                        className="max-w-7xl mx-auto bg-on-background rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-64 h-64 border-2 border-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2">
                        </div>
                        <div
                            className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl">
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-editorial">Ready to design a better
                                world?</h2>
                            <p className="text-white/70 text-lg mb-10 leading-relaxed">
                                Join our community of visionaries, designers, and conscious consumers. Whether you're looking
                                for a partnership or simply want to support the movement, there's a place for you in the
                                ecosystem.
                            </p>
                            <div className="flex-1 items-center gap-4 justify-center flex-wrap flex">

                                <button
                                    onClick={handleSchedulePickup}
                                    className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-container transition-all scale-100 hover:scale-105 inline-flex items-center justify-center"
                                >
                                    Schedule Your First Pickup
                                </button>

                                <Link
                                    href="/contact"
                                    className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center justify-center"
                                >
                                    Speak with a Specialist
                                </Link>

                            </div>
                        </div>
                    </div>
                </section>

            </main >
            <Footer />
        </>
    );
}