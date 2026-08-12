'use client';

import LocationPicker from "@/components/auth/LocationPicker";
import { userService } from "@/services/userService";
import { useAppSelector } from "@/store/hooks";
import { User } from "@/types/api";
import { getBadgeProgress, getBadges } from "@/utils/helper";
import { useEffect, useState } from "react";

export default function SettingsPage() {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [successMessage, setSuccessMessage] =
        useState('');

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordError, setPasswordError] =
        useState('');

    const [passwordSuccess, setPasswordSuccess] =
        useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.getUser();
                setUser(data);
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        setName(user.name);
        setEmail(user.email);
        setNumber1(user.number?.[0] || '');
        setNumber2(user.number?.[1] || '');
        setLocation(user.location);
    }, [user]);

    const imageUrl = user?.profileImage
        ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
        : "/default-avatar.png";

    const points = user?.points ?? 0;

    const formatName = (name: string | undefined) =>
        name
            ?.split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);

        // cleanup old preview
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleLocationSelect = (
        address: string,
        lat: string,
        lng: string
    ) => {
        setLocation(address);
        console.log('Selected location:', address, lat, lng);
        setLatitude(lat);
        setLongitude(lng);
    };



    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?._id || saving) return;

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const formData = new FormData();

            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('number1', number1.trim());
            formData.append('location', location);

            if (number2?.trim()) {
                formData.append('number2', number2.trim());
            }

            // IMPORTANT: ensure consistency
            if (latitude && longitude) {
                formData.append('latitude', latitude);
                formData.append('longitude', longitude);
            }

            if (selectedImage) {
                formData.append('profileImage', selectedImage);
            }

            const response = await userService.updateUser(
                user._id,
                formData
            );

            setSuccess(response.msg);

            setUser(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    name: response.user.name,
                    email: response.user.email,
                    location: response.user.location,
                    number: response.user.number,
                    latitude: response.user.latitude,
                    longitude: response.user.longitude,
                    profileImage: response.user.profileImage, // 🔥 IMPORTANT
                };
            });

            // sync UI
            setName(response.user.name);
            setEmail(response.user.email);
            setLocation(response.user.location);
            setNumber1(response.user.number?.[0] || '');
            setNumber2(response.user.number?.[1] || '');

            // IMPORTANT: sync coordinates too
            setLatitude(response.user.latitude || '');
            setLongitude(response.user.longitude || '');

            // cleanup preview memory
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

        } catch (err: any) {
            setError(
                err?.response?.data?.msg ||
                'Update failed'
            );
        } finally {
            setSaving(false);
        }
    };


    const handleCancel = () => {
        if (!user) return;

        setName(user.name);
        setEmail(user.email);
        setLocation(user.location);

        setNumber1(user.number?.[0] || '');
        setNumber2(user.number?.[1] || '');

        setLatitude(user.latitude || '');
        setLongitude(user.longitude || '');

        setSelectedImage(null);
        setPreviewUrl('');
        setError('');
        setSuccess('');
    };

    const handleChangePassword = async () => {
        if (!user?._id) return;

        setPasswordError('');
        setPasswordSuccess('');

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setPasswordError(
                'Please fill all password fields.'
            );
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(
                'New password must contain at least 8 characters.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                'Passwords do not match.'
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const response =
                await userService.changePassword(
                    user._id,
                    {
                        oldPassword: currentPassword,
                        newPassword,
                    }
                );

            setPasswordSuccess(response.msg);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(
                err?.response?.data?.msg ||
                'Failed to update password.'
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const [badgeProgress, setBadgeProgress] = useState<any>(null);
    const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [loadingBadges, setLoadingBadges] = useState(true);


    useEffect(() => {

        const loadBadges = async () => {

            try {

                const [
                    progress,
                    badges,
                ] = await Promise.all([
                    getBadgeProgress(points),
                    getBadges(),
                ]);


                const earned = badges
                    .filter(
                        (badge) =>
                            points >= badge.threshold
                    )
                    .sort(
                        (a, b) =>
                            a.threshold - b.threshold
                    );

                setBadges(badges);
                setBadgeProgress(progress);
                setEarnedBadges(earned);


            } finally {

                setLoadingBadges(false);

            }

        };


        loadBadges();

    }, [points]);



    if (loadingBadges || !badgeProgress) {
        return (
            <div>
                Loading badges...
            </div>
        );
    }



    const progressPercentage =
        badgeProgress.nextThreshold !== null
            ? (
                ((points -
                    badgeProgress.currentMin) /
                    (badgeProgress.nextThreshold -
                        badgeProgress.currentMin)) *
                100
            )
            : 100;

    //if (loading) {
    //    return <div>Loading...</div>;
    //}

    //if (!user) {
    //    return <div>User not found.</div>;
    //}

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Main Content Area */}
            <main className="flex-1 max-w-12xl mx-auto w-full">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">Member Profile</h1>
                    <p className="text-on-surface-variant max-w-2xl">Manage your ecological identity and track your contribution
                        to the gallery's shared sustainability goals.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Impact Stats & Bio */}
                    <section className="lg:col-span-5 space-y-8">
                        {/* Profile Card */}
                        <div
                            className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_12px_32px_rgba(20,29,32,0.04)] relative overflow-hidden">
                            <div
                                className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-bl-full -mr-8 -mt-8">
                            </div>
                            <div className="relative flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary mb-4">
                                    <img
                                        className="w-full h-full rounded-full object-cover border-4 border-white"
                                        src={imageUrl}
                                        alt={user?.name}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-on-surface">{formatName(user?.name)}</h2>
                                <p className="text-primary font-semibold text-sm tracking-wide uppercase mt-1">
                                    {user?.badge || 'None'}</p>
                                {/*<p className="mt-4 text-on-surface-variant text-sm leading-relaxed italic">"Passionate about
                                    circular economies and urban rewilding. Working towards a zero-waste lifestyle through
                                    the EcoGallery community."</p>*/}
                            </div>
                        </div>
                        {/*Impact Bento */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary-container/20 p-6 rounded-3xl flex flex-col justify-between">
                                <span className="material-symbols-outlined text-primary mb-4"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                                <div>
                                    <div className="text-3xl font-extrabold text-on-primary-container">{user?.points ?? 0}</div>
                                    <div className="text-xs font-bold text-on-primary-container/60 uppercase tracking-widest">
                                        Points Earned</div>
                                </div>
                            </div>
                            <div className="bg-secondary-container/20 p-6 rounded-3xl flex flex-col justify-between">
                                <span className="material-symbols-outlined text-secondary mb-4"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>recycling</span>
                                <div>
                                    <div className="text-3xl font-extrabold text-on-secondary-container">{user?.CO2Saved.toFixed(2) ?? 0}kg</div>
                                    <div className="text-xs font-bold text-on-secondary-container/60 uppercase tracking-widest">
                                        Waste Diverted</div>
                                </div>
                            </div>
                            <div className="col-span-2 bg-white p-6 rounded-3xl border border-outline-variant/20 flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-on-surface">
                                        Next Milestone
                                    </div>

                                    <div className="text-sm text-primary">
                                        {badgeProgress.next}
                                    </div>

                                    {badgeProgress.next && (
                                        <div className="text-sm text-slate-500 mt-1">
                                            {(user?.points ?? 0)} / {badgeProgress.nextThreshold} points
                                        </div>
                                    )}
                                </div>

                                <div className="relative w-16 h-16">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-slate-200"
                                        />

                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-primary"
                                            strokeDasharray="175.9"
                                            strokeDashoffset={
                                                175.9 - (175.9 * progressPercentage) / 100
                                            }
                                        />
                                    </svg>

                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                        {Math.round(progressPercentage)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Badges */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">military_tech</span>
                                Badges Earned
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {earnedBadges
                                    .filter((badge) => points >= badge.threshold)
                                    .map((badge) => (
                                        <div
                                            key={badge.name}
                                            className="px-4 py-2 bg-surface-container-high rounded-full flex items-center gap-2"
                                        >
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                {badge.icon}
                                            </span>

                                            <span className="text-xs font-bold">
                                                {badge.name}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">
                                        military_tech
                                    </span>

                                    All Badge Levels
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {badges.map((badge) => {
                                        const unlocked = points >= badge.threshold;

                                        return (
                                            <div
                                                key={badge.name}
                                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition ${unlocked
                                                    ? "bg-primary-container text-primary"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-sm"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    {badge.icon}
                                                </span>

                                                <span className="text-xs font-bold">
                                                    {badge.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </section>
                    {/* Right Column: Edit Profile Form */}
                    <section className="lg:col-span-7">
                        <div className="bg-surface-container-low p-8 md:p-10 rounded-[2rem] border-2 border-white">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-on-surface">Account Management</h2>
                                <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Personal
                                    Data</span>
                            </div>
                            <form className="space-y-8" onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label
                                            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Full
                                            Name</label>
                                        <input
                                            className="w-full bg-white border-none rounded-xl py-4 px-5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                            type="text"
                                            //defaultValue="Elena Greenwell"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email
                                            Address</label>
                                        <input
                                            className="w-full bg-white border-none rounded-xl py-4 px-5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Phone Number
                                    </label>

                                    <input
                                        className="w-full bg-white rounded-xl px-5 py-4"
                                        value={number1}
                                        onChange={(e) =>
                                            setNumber1(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Phone Number 2
                                    </label>
                                    <input
                                        placeholder="Second number (optional)"
                                        value={number2}
                                        onChange={(e) =>
                                            setNumber2(e.target.value)
                                        }
                                        className="w-full bg-white rounded-xl px-5 py-4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                            Location
                                        </label>

                                        <LocationPicker
                                            onLocationSelect={handleLocationSelect}
                                        />

                                        {location && (
                                            <div className="mt-2 text-sm text-on-surface-variant">
                                                Selected: {location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Avatar Update
                                    </label>

                                    {/* Clickable upload area */}
                                    <label className="flex items-center gap-6 p-6 bg-white rounded-2xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer">

                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                                            <span className="material-symbols-outlined text-on-surface-variant">
                                                cloud_upload
                                            </span>
                                        </div>

                                        {/* Preview or placeholder 
                                        <div className="w-16 h-16 rounded-full bg-surface-container overflow-hidden flex items-center justify-center">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : user?.profileImage ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-on-surface-variant">
                                                    cloud_upload
                                                </span>
                                            )}
                                        </div>
                                        */}

                                        {/* Text */}
                                        <div>
                                            <div className="text-sm font-bold">
                                                Drag & Drop or Click
                                            </div>
                                            <div className="text-xs text-on-surface-variant">
                                                SVG, PNG, JPG (max. 800x800px)
                                            </div>
                                        </div>
                                    </label>

                                    {/* Optional helper */}
                                    {selectedImage && (
                                        <p className="text-xs text-primary">
                                            Selected: {selectedImage.name}
                                        </p>
                                    )}
                                </div>
                                {error && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                                        {success}
                                    </div>
                                )}
                                <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-full sm:w-auto px-10 py-4 text-on-surface-variant font-bold hover:bg-surface-container-high rounded-full transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                            <div className="space-y-8 mt-12 pt-8 border-t border-outline-variant/20">
                                <h3 className="text-2xl font-bold text-on-surface mb-4">
                                    Security settings
                                </h3>
                                <div className="space-y-4">

                                    <div className="space-y-2">
                                        <label htmlFor="currentPassword"
                                            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Password</label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter current password"
                                            className="w-full bg-white border-none rounded-xl py-4 px-5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="newPassword"
                                            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">New Password</label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter new password"
                                            className="w-full bg-white border-none rounded-xl py-4 px-5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                                        >
                                            Confirm New Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm new password"
                                            className="w-full bg-white border-none rounded-xl py-4 px-5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    {passwordError && (
                                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                                            {passwordError}
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
                                            {passwordSuccess}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={passwordLoading}
                                            className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {passwordLoading
                                                ? 'Updating...'
                                                : 'Update Password'}
                                        </button>
                                    </div>

                                </div>
                            </div>
                            {/*<div className="mt-12 pt-8 border-t border-outline-variant/20">
                                <h3 className="text-lg font-bold text-on-surface mb-4">Security Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-secondary">lock</span>
                                            <div>
                                                <div className="text-sm font-bold">Two-Factor Authentication</div>
                                                <div className="text-xs text-on-surface-variant">Add an extra layer of security
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-sm font-bold text-primary">Enable</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-secondary">visibility</span>
                                            <div>
                                                <div className="text-sm font-bold">Public Profile</div>
                                                <div className="text-xs text-on-surface-variant">Allow others to see your impact
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-12 h-6 bg-primary rounded-full relative">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}