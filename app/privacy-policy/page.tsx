// app/components/PrivacyPolicy.tsx
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";

const navigation = [
    { href: "#introduction", label: "Introduction" },
    { href: "#collections", label: "Data Stewardship" },
    { href: "#metrics", label: "Circular Metrics" },
    { href: "#transactional", label: "Transactional Integrity" },
    { href: "#security", label: "Security Standards" },
    { href: "#initiatives", label: "Environmental Initiatives" },
    { href: "#contact", label: "Contact Laboratory" },
];

const metrics = [
    {
        title: "CO2 Offset Calculations",
        description:
            "Conversion of your recycling volumes into verifiable carbon footprint reductions.",
    },
    {
        title: "Point Accumulation",
        description:
            "Real-time tracking of reward points where 1 point = 0.1 TND, redeemable across our ecosystem.",
    },
    {
        title: "Badge Progression",
        description:
            "Gamified tracking of your journey from 'Bee' to 'Malachite' status.",
    },
    {
        title: "Social Impact Scoring",
        description:
            "Aggregated data used for community-wide environmental achievement reporting.",
    },
];

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <main className="pt-20 bg-surface min-h-screen">
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    {/* Hero Header */}
                    <header className="mb-16">
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                            Legal Framework
                        </span>

                        <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-tight">
                            Privacy Protocol &amp;
                            <br />
                            <span className="text-primary">Data Stewardship</span>
                        </h1>

                        <p className="mt-6 text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                            At Colibris, the restoration of nature begins with the respect of the
                            individual. Our privacy policy is designed to be as clear as the
                            circular environments we strive to protect.
                        </p>
                    </header>

                    <div className="flex flex-col gap-12 lg:gap-20 md:flex-row">
                        {/* Sidebar */}
                        <aside className="md:w-64 flex-shrink-0 mb-4">
                            <div className="sticky top-40 space-y-4">
                                <h4 className="text-on-surface font-bold text-xs uppercase tracking-widest mb-6">
                                    Navigation
                                </h4>

                                <nav className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="sidebar-link text-on-surface-variant hover:text-primary text-sm font-medium"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>

                                <div className="mt-12 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6">
                                    <span className="material-symbols-outlined text-primary mb-3">
                                        verified_user
                                    </span>

                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        Last updated:
                                        <br />
                                        <span className="font-bold text-on-surface">
                                            June 26, 2026
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Content */}
                        <article className="privacy-content max-w-3xl flex-1">
                            <section id="introduction" className="scroll-mt-32">
                                <p className="mb-8 text-xl italic font-medium leading-relaxed text-on-surface">
                                    "In the silent restoration of our planet, every byte of data
                                    represents a step toward a sustainable future. We treat your
                                    information with the same reverence we treat a delicate ecosystem."
                                </p>

                                <p>
                                    This Privacy Protocol outlines how Colibris collects, protects, and utilizes the information
                                    gathered during your journey through our circular economy platform.
                                    By engaging with our services, you entrust us with your data, and
                                    we take that responsibility seriously.
                                </p>
                            </section>

                            <section id="collections" className="scroll-mt-32 mt-16">
                                <h2 className="text-primary font-bold text-2xl uppercase tracking-widest mb-6">Data Stewardship for Collections</h2>

                                <p>
                                    To facilitate our seamless waste recovery and recycling system, we
                                    process specific data sets required for logistical excellence:
                                </p>

                                <ul className="mt-6 space-y-4">
                                    <li className="group flex gap-4 rounded-xl bg-surface-container-low p-5 transition-all hover:bg-surface-container-high">
                                        <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                                            location_on
                                        </span>

                                        <div>
                                            <strong className="mb-1 block text-on-surface">
                                                Precise Geolocation
                                            </strong>

                                            <span className="text-sm text-on-surface-variant">
                                                Used exclusively for scheduling pickups and optimizing route
                                                efficiency for our collection fleet.
                                            </span>
                                        </div>
                                    </li>

                                    <li className="group flex gap-4 rounded-xl bg-surface-container-low p-5 transition-all hover:bg-surface-container-high">
                                        <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                                            delete_sweep
                                        </span>

                                        <div>
                                            <strong className="mb-1 block text-on-surface">
                                                Waste Morphology
                                            </strong>

                                            <span className="text-sm text-on-surface-variant">
                                                Information regarding the types and volumes of recyclables
                                                or liquid refill containers you manage.
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            <div className="my-16 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

                            <section id="metrics" className="scroll-mt-32">
                                <h2 className="text-primary font-bold text-2xl uppercase tracking-widest mb-6">Circular Metrics &amp; Points</h2>

                                <p>
                                    Our platform quantifies your positive impact. This involves the
                                    processing of dynamic performance data:
                                </p>

                                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {metrics.map((metric) => (
                                        <div
                                            key={metric.title}
                                            className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm"
                                        >
                                            <h4 className="mb-2 font-bold text-primary">
                                                {metric.title}
                                            </h4>

                                            <p className="m-0 text-sm">{metric.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section id="transactional" className="scroll-mt-32 mt-16">
                                <h2 className="text-primary font-bold text-2xl uppercase tracking-widest mb-6">Transactional Integrity</h2>

                                <p>
                                    Whether you are browsing the Recyclable Products Shop or engaging
                                    with the Liquid Refill Shop, your transactional data is handled
                                    with absolute transparency.
                                </p>

                                <div className="relative mt-8 mb-8 overflow-hidden rounded-3xl bg-on-surface p-8 text-surface">
                                    <div className="relative z-10">
                                        <h4 className="mb-4 text-xl font-bold">
                                            Unified Commerce
                                        </h4>

                                        <p className="mb-6 text-sm text-surface/70">
                                            We maintain a secure history of your orders and refill
                                            subscriptions to ensure continuity of service and accurate
                                            point distribution.
                                        </p>

                                        <button className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                                            Order History
                                        </button>
                                    </div>

                                    <div className="absolute -bottom-12 -right-12 opacity-10">
                                        <span className="material-symbols-outlined text-[160px]">
                                            shopping_bag
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section id="security" className="scroll-mt-32 mt-20">
                                <h2 className="mb-6 text-2xl font-bold uppercase tracking-widest text-primary">
                                    Keeping Your Information Safe
                                </h2>

                                <p className="mb-8 max-w-2xl text-on-surface-variant leading-relaxed">
                                    Protecting your personal information is an important part of how we build
                                    trust. We take reasonable measures to safeguard your data and continuously
                                    improve our practices to keep your information secure.
                                </p>

                                <div className="grid gap-4 md:grid-cols-1">
                                    <div className="rounded-2xl border border-primary/10 bg-surface-container-low p-6">
                                        <span className="material-symbols-outlined mb-4 text-3xl text-primary">
                                            lock
                                        </span>

                                        <h3 className="mb-2 font-semibold text-on-surface">
                                            Protected Accounts
                                        </h3>

                                        <p className="text-sm leading-relaxed text-on-surface-variant">
                                            We work to protect your account from unauthorized access and encourage
                                            the use of strong passwords to help keep your information secure.
                                        </p>
                                    </div>

                                    {/*<div className="rounded-2xl border border-primary/10 bg-surface-container-low p-6">
                                        <span className="material-symbols-outlined mb-4 text-3xl text-primary">
                                            payments
                                        </span>

                                        <h3 className="mb-2 font-semibold text-on-surface">
                                            Secure Payments
                                        </h3>

                                        <p className="text-sm leading-relaxed text-on-surface-variant">
                                            Payments are processed through trusted providers, allowing us to offer
                                            a safe checkout experience while limiting the sensitive information we
                                            store.
                                        </p>
                                    </div>*/}

                                    <div className="rounded-2xl border border-primary/10 bg-surface-container-low p-6">
                                        <span className="material-symbols-outlined mb-4 text-3xl text-primary">
                                            update
                                        </span>

                                        <h3 className="mb-2 font-semibold text-on-surface">
                                            Ongoing Improvements
                                        </h3>

                                        <p className="text-sm leading-relaxed text-on-surface-variant">
                                            We regularly review and improve our systems to help maintain a secure
                                            and reliable platform for everyone.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-primary/10 bg-surface-container-low p-6">
                                        <span className="material-symbols-outlined mb-4 text-3xl text-primary">
                                            verified_user
                                        </span>

                                        <h3 className="mb-2 font-semibold text-on-surface">
                                            Privacy First
                                        </h3>

                                        <p className="text-sm leading-relaxed text-on-surface-variant">
                                            We only collect the information needed to provide our services and
                                            handle it responsibly in accordance with this Privacy Policy.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl border border-primary/10 bg-primary/5 p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-3xl text-primary">
                                            shield
                                        </span>

                                        <div>
                                            <h3 className="mb-2 font-semibold text-on-surface">
                                                Our Commitment
                                            </h3>

                                            <p className="text-on-surface-variant leading-relaxed">
                                                While no online service can guarantee absolute security, we are
                                                committed to protecting your information, responding promptly to
                                                potential issues, and continually improving how we safeguard your
                                                data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative mt-8 h-48 overflow-hidden rounded-3xl">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi2ZR4KRy01LzLJw5-O4cy_otNFi3LXX2Dcch5RiEORpjDGLQkIkSRTK4_n9mXryC1y7tJvPzASdgafSi1PzoSRoSPksB0DWjSPaBph6u2fEAg7CA73a59mtWEOgt70cYIg4tXU3-05UmGCh20M6srnu1xVZzAgRuHRvN_9LXRqFNx9GUJvVLwFgeAczj4vLyMydIF8khidSTNPzi_dP9Ku5yQH_2PRrE2FHEwMRl354_psA_cYeLEqw"
                                        alt="Circuit board with green vine patterns"
                                        fill
                                        className="object-cover grayscale transition-all duration-1000 hover:grayscale-0"
                                    />
                                </div>
                            </section>

                            <section id="initiatives" className="scroll-mt-32 mt-20">
                                <h2 className="mb-6 text-2xl font-bold uppercase tracking-widest text-primary">
                                    Environmental Initiative Contributions
                                </h2>

                                <p className="mb-8 max-w-2xl text-on-surface-variant">
                                    Transparency is one of the foundations of our environmental mission. We
                                    ensure that every contribution made through Colibris can be traced to
                                    verified initiatives while protecting the privacy of our community.
                                </p>

                                <div className="rounded-3xl border border-primary/15 bg-surface-container-low p-8 shadow-sm">
                                    <div className="flex items-start gap-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-3xl">
                                                public
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-lg font-semibold text-on-surface">
                                                Transparency Pledge
                                            </h4>

                                            <p className="leading-relaxed text-on-surface-variant">
                                                When reward points are donated or eligible purchases support
                                                environmental programs, Colibris transfers funds to verified
                                                organizations and reports aggregate impact metrics without sharing
                                                personally identifiable information.
                                            </p>

                                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                                                <span className="material-symbols-outlined text-lg">
                                                    verified
                                                </span>
                                                Verified partners • Privacy-first reporting
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="contact" className="scroll-mt-20 mt-20 mb-6">
                                <h2 className="mb-6 text-2xl font-bold uppercase tracking-widest text-primary">
                                    Contact Our Team
                                </h2>

                                <p className="mb-8 max-w-2xl text-on-surface-variant">
                                    If you have any questions about this Privacy Policy, your personal data,
                                    or how Colibris processes information, our team is here to help.
                                </p>

                                <div className="rounded-3xl border border-primary/15 bg-surface-container-low p-8 shadow-sm">
                                    <div className="flex items-start gap-5">
                                        <div className="biophilic-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-on-primary">
                                            <span className="material-symbols-outlined text-2xl">
                                                support_agent
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-on-surface">
                                                Privacy & Support Team
                                            </h4>

                                            <p className="mt-2 text-on-surface-variant leading-relaxed">
                                                Reach out through our contact page for privacy requests, account
                                                inquiries, or any questions regarding our data practices.
                                            </p>

                                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                                <a
                                                    href="/contact"
                                                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
                                                >
                                                    Contact Us
                                                    <span className="material-symbols-outlined text-lg">
                                                        arrow_forward
                                                    </span>
                                                </a>

                                                <span className="text-sm text-on-surface-variant">
                                                    Typical response time: <strong>24–48 hours</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </section>
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}