// components/RestrictedAccess.jsx

import { Footer } from "@/components/layout/Footer";

import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function RestrictedAccess() {
    return (
        <>
            <Navbar />
            <main className="flex-grow flex items-center justify-center relative p-8 mt-8">
                <div className="w-full max-w-2xl flex flex-col items-center text-center">
                    {/* Logo Header */}
                    <div className="mb-16 transform transition-transform duration-700 hover:scale-105 ease-out">
                        <Image
                            alt="Colibris Logo"
                            className="h-48 w-auto object-contain drop-shadow-sm opacity-90"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcFBIxF41m0hVnhLMmUqMlKh09Cey9CxtmRGuNlSvK7VutiWoeo8P8INDBYWkFVwrybneUyTrGYz9GrmvrF8WYxmAQO-fYK4pQ-0Je3yLyKIJYwR5MUEFEzMQTWJzoxOHon7VZE2wbnNbTAOpx8WS4oDUDAkfM8UVPQS_eqpD-4lyacOwpfwS5N6jcWCOkTicV-wvExzn3_4jSKOUn60fOKz8WrIrwvocVsfROWztCLrLk5p6RN3uIYbh-zCv0jPvVWX0"
                            width={192}
                            height={192}
                        />
                    </div>

                    {/* Error Content */}
                    <div className="relative w-full max-w-lg">
                        {/* 403 watermark */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-display font-bold text-[10rem] leading-none text-surface-container tracking-tighter select-none z-0">
                            403
                        </div>

                        {/* Content Panel */}
                        <div className="relative z-10 bg-surface-container-lowest/80 backdrop-blur-2xl rounded-xl p-12 shadow-[0_12px_32px_rgba(20,29,32,0.06)] border border-outline-variant/10">
                            <div className="flex justify-center mb-6 text-primary">
                                <span
                                    className="material-symbols-outlined text-5xl"
                                    style={{
                                        fontVariationSettings: "'FILL' 1",
                                    }}
                                >
                                    security
                                </span>
                            </div>

                            <h1 className="font-headline font-bold text-headline-lg text-on-surface mb-6 tracking-tight">
                                Restricted Access
                            </h1>

                            <p className="font-body text-body-lg text-on-surface-variant mb-10 leading-relaxed max-w-md mx-auto">
                                It seems you've reached a protected part of the ecosystem. This
                                area is reserved for specific curators.
                            </p>

                            <div className="flex justify-center">
                                <Link
                                    href="/"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary rounded-full font-label text-label-md font-bold uppercase tracking-wider overflow-hidden transition-transform active:scale-95"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <span className="relative z-10 flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-lg"
                                            style={{
                                                fontVariationSettings: "'FILL' 0",
                                            }}
                                        >
                                            arrow_back
                                        </span>

                                        Return Home
                                    </span>
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