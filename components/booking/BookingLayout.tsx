
import { ReactNode } from "react";

export default function BookingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {children}
            </div>
        </div>
    );
}