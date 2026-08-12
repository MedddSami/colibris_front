import { Pack, User } from "@/types/api";

interface SubscriptionDetailsModalProps {
    open: boolean;
    user: User | null;
    packMap: Map<string, Pack>;
    onClose: () => void;
}

export default function SubscriptionDetailsModal({
    open,
    user,
    packMap,
    onClose,
}: SubscriptionDetailsModalProps) {

    if (!open || !user) return null;

    const activePack = user.purchasedPacks?.find(
        (p) => p.status === "granted"
    );

    const activePurchase = user?.purchasedPacks?.find(
        (p) => p.status === "granted"
    );

    const packId =
        typeof activePurchase?.packId === "string"
            ? activePurchase.packId
            : activePurchase?.packId?._id;

    const pack = packId ? packMap.get(packId) : null;

    if (!activePack) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-surface-container-lowest p-6 rounded-2xl w-[420px]">
                    <p className="text-center text-on-surface-variant">
                        No active subscription found
                    </p>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[520px] rounded-[2rem] bg-surface-container-lowest shadow-xl p-8">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Subscription Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>

                {/* USER INFO */}
                <div className="mt-6">
                    <p className="text-sm text-on-surface-variant">
                        User
                    </p>

                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-on-surface-variant">
                        {user.email}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                        {user.number?.[0] ?? "-"}
                    </p>
                </div>

                {/* PACK INFO */}
                <div className="mt-6">
                    <p className="text-sm text-on-surface-variant">
                        Active Pack
                    </p>

                    <p className="font-semibold">{pack?.name}</p>
                    <p className="text-sm text-on-surface-variant">
                        {pack?.description}
                    </p>
                    <div className="flex gap-4 mt-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {pack?.price} DT
                        </span>

                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {pack?.points} pts
                        </span>
                    </div>
                </div>

                {/* SUBSCRIPTION INFO */}
                <div className="mt-6">
                    <p className="text-sm text-on-surface-variant">
                        Subscription
                    </p>

                    <div className="space-y-1 text-sm">
                        <p>
                            Purchase Date:{" "}
                            {new Date(activePack.purchaseDate).toLocaleDateString()}
                        </p>

                        <p>
                            Valid until:{" "}
                            {new Date(activePack.accessUntil).toLocaleDateString()}
                        </p>

                        <p>
                            Delivery Option: {activePack.deliveryOption}
                        </p>

                        <p>
                            Status:{" "}
                            <span className="text-primary font-medium">
                                {activePack.status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* DELIVERY INFO */}
                <div className="mt-6">
                    <p className="text-sm text-on-surface-variant">
                        Delivery Location
                    </p>

                    <p className="text-sm">{activePack.location}</p>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}