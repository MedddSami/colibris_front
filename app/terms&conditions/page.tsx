import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            {/* Hero Section */}
            <main className="px-8 md:px-16 pb-32">

                <section className="pt-40 pb-20 px-8 md:px-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-2xl">
                                <span className="inline-block px-4 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                                    Colibris Legal Protocol
                                </span>

                                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1]">
                                    Terms of <span className="text-primary">Service</span>
                                </h1>
                            </div>

                            <div className="text-on-surface-variant font-medium text-lg border-l-2 border-primary pl-6 py-2">
                                Effective Date: November 25 June, 2026
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}


                {/* Side Navigation */}
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    <div className="flex flex-col gap-12 lg:gap-20 md:flex-row">
                        <aside className="md:w-64 flex-shrink-0 mb-4 space-y-4 sticky top-40 h-fit">
                            <p className="text-xs font-bold text-outline uppercase tracking-widest mb-6 pl-4">
                                Legal Directory
                            </p>

                            <nav className="flex flex-col">
                                {[
                                    ["01", "Collection & Pickup", "#collection"],
                                    ["02", "Point System", "#points"],
                                    ["03", "Subscriptions & Packs", "#subscriptions"],
                                    ["04", "Shop & Refill Terms", "#shop"],
                                    ["05", "Badges & Conduct", "#gamification"],
                                    ["06", "Security & Integrity", "#security"],
                                ].map(([number, label, href]) => (
                                    <a
                                        key={number}
                                        href={href}
                                        className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all"
                                    >
                                        <span className="text-primary font-bold">
                                            {number}
                                        </span>

                                        <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                                            {label}
                                        </span>
                                    </a>
                                ))}
                            </nav>
                        </aside>

                        {/* Legal Articles */}
                        <div className="space-y-24">

                            {/* Intro Card */}
                            <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-[0px_12px_32px_rgba(0,108,74,0.04)] border border-outline-variant/10">
                                <p className="text-lg leading-relaxed text-on-surface-variant">
                                    Welcome to the Colibris ecosystem. These Terms of Service govern
                                    your participation in our circular economy platform, including
                                    our waste collection services, reward mechanisms, and curated
                                    sustainable commerce. By engaging with Colibris, you commit to
                                    our standard of ecological stewardship.
                                </p>
                            </div>

                            {/* Section 01 */}
                            <section className="scroll-mt-32" id="collection">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        01
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        Collection & Pickup Reservation
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <p>
                                        Our "Collection" service is the cornerstone of the Colibris
                                        experience. Users are responsible for accurate scheduling and
                                        preparation of recyclables.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                            <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">
                                                    schedule
                                                </span>
                                                Scheduling
                                            </h4>

                                            <p className="text-sm">
                                                Reservations must be made at least 24 hours in advance via
                                                the Colibris app. Cancellations within 2 hours of the
                                                window may incur a 5 TND penalty.
                                            </p>
                                        </div>

                                        <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                            <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">
                                                    inventory_2
                                                </span>
                                                Waste Preparation
                                            </h4>

                                            <p className="text-sm">
                                                Items must be cleaned and sorted into categories:
                                                Plastic, Paper, Glass, Cans, or Mixed. Highly contaminated
                                                batches will be rejected without point credit.
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary text-sm mt-1">
                                                check_circle
                                            </span>

                                            <span>
                                                <strong>User Responsibility:</strong> Ensure the
                                                "Ecobox" or prepared bags are accessible to the Colibris
                                                agent at the reserved time and location.
                                            </span>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary text-sm mt-1">
                                                check_circle
                                            </span>

                                            <span>
                                                <strong>Agent Access:</strong> Users must provide clear
                                                instructions for gated communities or apartment
                                                buildings. Failure to provide access counts as a "Missed
                                                Collection."
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </section>


                            {/* Section 02 */}
                            <section className="scroll-mt-32" id="points">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        02
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        The Colibris Point System (TND)
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <p>
                                        We utilize a digital token system to reward ecological
                                        contributions. Points are non-transferable and have no cash
                                        value outside the Colibris platform.
                                    </p>

                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-primary mb-2">
                                                Standard Conversion
                                            </h4>

                                            <p className="text-3xl font-extrabold text-on-surface">
                                                1 Point = 0.1 TND
                                            </p>

                                            <p className="text-sm mt-2 opacity-80">
                                                Values are pegged to our internal ecological impact
                                                metric and may be adjusted based on market recycling
                                                rates with 30 days notice.
                                            </p>
                                        </div>

                                        <div className="w-full md:w-px h-px md:h-20 bg-outline-variant/30" />

                                        <div className="flex-1">
                                            <h4 className="font-bold text-on-surface mb-2">
                                                Redemption Pathways
                                            </h4>

                                            <ul className="text-sm space-y-2">
                                                <li>• Exclusive Shop Discounts</li>
                                                <li>• Verified Environmental Donations</li>
                                                <li>• Partner Brand Voucher Exchange</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-surface-container-high p-6 rounded-xl italic text-sm">
                                        <strong>Note on Expiration:</strong> Points balance
                                        expire after 12 months of account inactivity. Users will
                                        receive notifications 30 days prior to expiration.
                                    </div>
                                </div>
                            </section>


                            {/* Section 03 */}
                            <section className="scroll-mt-32" id="subscriptions">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        03
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        Subscriptions & Packs
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <p>
                                        Colibris offers tiered commitment levels to suit different
                                        household and commercial needs.
                                    </p>

                                    {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary transition-colors">
                                            <h4 className="font-bold text-on-surface text-lg">
                                                Essential
                                            </h4>
                                            <p className="text-xs uppercase tracking-widest text-outline mb-4">
                                                Pay-As-You-Go
                                            </p>
                                            <p className="text-sm">
                                                Standard collection rates. 1x point multiplier. Basic
                                                dashboard access.
                                            </p>
                                        </div>

                                        <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full">
                                                POPULAR
                                            </div>

                                            <h4 className="font-bold text-on-surface text-lg">
                                                Artisan
                                            </h4>

                                            <p className="text-xs uppercase tracking-widest text-primary mb-4">
                                                Weekly Ritual
                                            </p>

                                            <p className="text-sm">
                                                4 scheduled pickups/mo. 1.5x point multiplier. Priority
                                                refill scheduling.
                                            </p>
                                        </div>

                                        <div className="p-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary transition-colors">
                                            <h4 className="font-bold text-on-surface text-lg">
                                                Guardian
                                            </h4>

                                            <p className="text-xs uppercase tracking-widest text-outline mb-4">
                                                Ultimate Impact
                                            </p>

                                            <p className="text-sm">
                                                Unlimited pickups. 2x point multiplier. Quarterly impact
                                                certification.
                                            </p>
                                        </div>
                                    </div>*/}

                                    <h4 className="text-2xl font-bold text-on-surface mb-3">
                                        Discover Colibris Packs
                                    </h4>

                                    <p className="text-on-surface-variant leading-relaxed">
                                        Explore our flexible collection plans designed for different
                                        lifestyles and environmental goals. Choose the pack that matches
                                        your recycling habits and unlock additional benefits across the
                                        Colibris ecosystem.
                                    </p>


                                    <a
                                        href="/packs"
                                        className="inline-flex items-center justify-center bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all hover:-translate-y-1 whitespace-nowrap"
                                    >
                                        Explore Packs
                                    </a>

                                    <p className="text-sm opacity-70 italic">
                                        Subscriptions are billed monthly. Cancellation takes effect
                                        at the end of the current billing cycle.
                                    </p>
                                </div>
                            </section>
                            {/* Section 04 */}
                            <section className="scroll-mt-32" id="shop">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        04
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        Shop & Refill Terms
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-xl font-bold text-on-surface">
                                                1. Recyclables Shop
                                            </h4>

                                            <p>
                                                Items sold here are upcycled or verified low-impact goods.
                                                We guarantee the provenance of all materials used in these
                                                products. Exchanges are permitted for manufacturing
                                                defects within 7 days.
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-xl font-bold text-on-surface">
                                                2. Refill Shop
                                            </h4>

                                            <p>
                                                The Colibris Refill Shop offers carefully selected liquid recycled products
                                                that support a circular lifestyle. Customers can bring clean reusable
                                                containers or choose Colibris-certified bottles. Product quality and safety
                                                standards are maintained through our refill process, while customers remain
                                                responsible for the condition of their own containers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>


                            {/* Section 05 */}
                            <section className="scroll-mt-32" id="gamification">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        05
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        Badges & Gamification
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <p>
                                        Our engagement system is designed to foster positive
                                        environmental habits. Exploitation of the badge system is
                                        strictly prohibited.
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30">
                                            <span className="material-symbols-outlined text-primary">
                                                military_tech
                                            </span>

                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Badge Integrity
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30">
                                            <span className="material-symbols-outlined text-primary">
                                                leaderboard
                                            </span>

                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Fair Competition
                                            </span>
                                        </div>
                                    </div>

                                    <p>
                                        Unauthorized manipulation of impact telemetry to earn badges
                                        or climb leaderboards will result in immediate account
                                        suspension and forfeiture of all earned points.
                                    </p>
                                </div>
                            </section>


                            {/* Section 06 */}
                            <section className="scroll-mt-32" id="security">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-bold">
                                        06
                                    </span>

                                    <h2 className="text-3xl font-bold text-on-surface">
                                        Security & Account Integrity
                                    </h2>
                                </div>

                                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                                    <p>
                                        Your Colibris account is your digital identity in our
                                        restoration network. You are responsible for:
                                    </p>

                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>
                                            Maintaining the confidentiality of your login credentials.
                                        </li>

                                        <li>
                                            Promptly notifying us of any unauthorized access or security
                                            breach.
                                        </li>

                                        <li>
                                            Ensuring all personal and payment information provided is
                                            accurate and current.
                                        </li>
                                    </ul>

                                    <div className="bg-error/5 border border-error/20 p-6 rounded-xl flex gap-4">
                                        <span className="material-symbols-outlined text-error">
                                            report
                                        </span>

                                        <p className="text-sm text-error">
                                            Colibris staff will never ask for your password via email or
                                            SMS. Report any such inquiries to contact@colibris.tn
                                            immediately.
                                        </p>
                                    </div>
                                </div>
                            </section>


                            {/* Contact Anchor */}
                            <div className="bg-primary-container p-12 rounded-[40px] text-on-primary-container flex flex-col md:flex-row justify-between items-center gap-8">
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">
                                        Legal Inquiry?
                                    </h3>

                                    <p className="opacity-90 text-on-primary-container/80">
                                        Our ecosystem governance team is available for clarification.
                                    </p>
                                </div>

                                <Link
                                    href="/contact"
                                    className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all hover:-translate-y-1"
                                >
                                    Contact US
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}