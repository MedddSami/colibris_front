import Image from "next/image";
import Link from "next/link";

export default function UserDashboardFooter() {
    return (
        <footer className="w-full bg-emerald-900 px-8 py-12">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <Link href="/">
                    <Image
                        src="/logo_horizontal_+_tagline_blanc_rvb.png"
                        alt="Colibris"
                        width={120}
                        height={50}
                        className="object-contain cursor-pointer"
                    />
                </Link>

                <div className="flex flex-wrap justify-center gap-8">
                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/privacy-policy"
                    >
                        Privacy Policy
                    </a>

                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/terms&conditions"
                    >
                        Terms of Service
                    </a>

                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/shop"
                    >
                        Shop
                    </a>

                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/refill-shop"
                    >
                        Refill Shop
                    </a>

                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/packs-initiatives"
                    >
                        Packs & Initiatives
                    </a>

                    <a
                        className="text-sm tracking-wide text-emerald-200/70 transition-all hover:text-white hover:underline underline-offset-4"
                        href="/contact"
                    >
                        Contact
                    </a>
                </div>

                <div className="text-sm text-emerald-200/70">
                    © {new Date().getFullYear()} Colibris. Precision in Sustainability.
                </div>
            </div>
        </footer>
    );
}