export default function UserDetailsModal({
    user,
    onClose,
}: {
    user: any;
    onClose: () => void;
}) {
    if (!user) return null;

    const coordsAvailable =
        user.latitude && user.longitude;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-surface-container-lowest rounded-[2rem] shadow-2xl p-6 relative">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-high"
                >
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={
                            user.profileImage ||
                            '/default-avatar.png'
                        }
                        className="w-16 h-16 rounded-2xl object-cover"
                    />

                    <div>
                        <h2 className="text-2xl font-bold text-on-surface">
                            {user.name}
                        </h2>
                        <p className="text-3sm text-on-surface-variant">
                            {user.email}
                        </p>

                        <div className="flex gap-2 mt-1">
                            <span className="text-sm px-3 py-1 rounded-full bg-primary-container text-white">
                                Role: {user.role}
                            </span>

                            <span
                                className={`text-sm px-3 py-1 rounded-full ${user.status === 'accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                    }`}
                            >
                                Status: {user.status}
                            </span>

                            {user.isVerified && (
                                <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">

                                    Email verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4 text-sm">

                    {/* BADGE */}
                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            Badge
                        </p>
                        <p className="font-bold">
                            {user.badge || 'N/A'}
                        </p>
                    </div>

                    {/* PHONE */}
                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            Phone
                        </p>
                        <p className="font-bold">
                            {user.number?.[0] || 'N/A'}
                        </p>
                    </div>

                    {/* POINTS */}
                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            Eco Points
                        </p>
                        <p className="font-bold text-primary">
                            {user.points ?? 0}
                        </p>
                    </div>

                    {/* CO2 */}
                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            CO₂ Saved
                        </p>
                        <p className="font-bold text-secondary">
                            {user.CO2Saved ?? 0} kg
                        </p>
                    </div>

                    {/* LOCATION */}
                    <div className="p-3 rounded-xl bg-surface-container-low col-span-2">
                        <p className="text-on-surface-variant">
                            Location
                        </p>
                        <p className="font-bold">
                            {user.location || 'N/A'}
                        </p>
                    </div>

                    {/* LAT / LNG */}
                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            Latitude
                        </p>
                        <p className="font-bold">
                            {user.latitude || 'N/A'}
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-on-surface-variant">
                            Longitude
                        </p>
                        <p className="font-bold">
                            {user.longitude || 'N/A'}
                        </p>
                    </div>

                    {/* PACKS */}
                    <div className="p-3 rounded-xl bg-surface-container-low col-span-2">
                        <p className="text-on-surface-variant">
                            Purchased Packs
                        </p>
                        <p className="font-bold">
                            {user.purchasedPacks?.length ||
                                0}
                        </p>
                    </div>

                    {/* USER ID 
                    <div className="p-3 rounded-xl bg-surface-container-low col-span-2">
                        <p className="text-on-surface-variant">
                            User ID
                        </p>
                        <p className="font-mono text-xs break-all">
                            {user._id}
                        </p>
                    </div>
                    */}
                </div>

                {/* ENTERPRISE ACTIONS 
                {user.role === 'entreprise' &&
                    user.status === 'pending' && (
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:scale-[1.02] transition">
                                Accept
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-error-container text-on-error-container font-bold hover:scale-[1.02] transition">
                                Refuse
                            </button>
                        </div>
                    )}
                */}
            </div>
        </div>
    );
}