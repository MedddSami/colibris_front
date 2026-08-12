import Link from "next/link";
import { Footer } from "../layout/Footer";
import { Navbar } from "../layout/Navbar";

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-12 md:py-24">

                {/* Logo */}
                <Link
                    href="/"
                    className="mb-16 transition-transform duration-300 hover:scale-105 md:mb-24"
                >
                    <img
                        alt="Colibris Logo"
                        className="h-32 w-auto object-contain md:h-12"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg-LRnI9LfwYPRsd2zn2dN108MRqG09iC3VGhW9drPgUdiJdcaXi4XVLW4n7xKtAlFYXgcpeIF2cLL098-_d-GWfr8XnKWDQsO4yjVEpOB7yEnxJQ_Jbz-Dfz2RK98-GDSr6glTEA34gCBC3VVIAzeCuClyd3MO4DAV90-Le2V5LXl73EesB_OanqOuMELCVcYR0qywr65dOxiX5NapVxF0NwWr1PSCPzoDWkUve2p5ed9iN5gt8PKCgEbsvOXPzkvo64"
                    />
                </Link>

                <div className="relative flex max-w-2xl flex-col items-center text-center">

                    <div
                        className="
                    absolute left-1/2 top-1/2
                    -z-10
                    -translate-x-1/2
                    -translate-y-1/2
                    select-none
                    text-[12rem]
                    font-bold
                    tracking-tighter
                    text-surface-container-high/60
                    md:text-[18rem]
                    "
                    >
                        404
                    </div>

                    <h1
                        className="
                    mb-6
                    text-headline-lg
                    font-bold
                    leading-tight
                    tracking-tight
                    text-primary
                    md:text-display-lg
                    "
                    >
                        Lost in the Canopy?
                    </h1>

                    <p
                        className="
                    mb-10
                    max-w-md
                    text-body-lg
                    leading-relaxed
                    text-on-surface-variant
                    md:mb-12
                    "
                    >
                        It seems you've wandered off the trail. The page you are looking for
                        has been moved, renamed, or perhaps returned to nature.
                    </p>

                    <Link
                        href="/"
                        className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-primary
                    px-8
                    py-4
                    text-lg
                    font-bold
                    text-on-primary
                    shadow-[0px_12px_32px_rgba(20,29,32,0.06)]
                    transition-all
                    duration-300
                    hover:bg-primary-container
                    hover:text-on-primary-container
                    active:scale-95
                    "
                    >
                        <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1">
                            west
                        </span>

                        Back to Safety
                    </Link>

                </div>
            </main>
            <Footer />
        </>
    );
}