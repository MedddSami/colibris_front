'use client';

import UserDetailsModal from "@/components/modals/UserDetailsModal";
import { adminService } from "@/services/adminService";
import { User } from "@/types/api";
import { getBadgeConfig } from "@/utils/helper";
import { useEffect, useState } from "react";


interface Props {
    search?: string;
}
export default function UsersPage({ search = "" }: Props) {
    const searchTerm = search;

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const USERS_PER_PAGE = 4;

    const [selectedBadge, setSelectedBadge] = useState('all');
    const [selectedView, setSelectedView] =
        useState<'active' | 'pending' | 'companies'>(
            'active'
        );

    const [sortField, setSortField] =
        useState<string>('name');

    const [sortDirection, setSortDirection] =
        useState<'asc' | 'desc'>('asc');

    const [selectedLocation, setSelectedLocation] =
        useState('all');

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getDistrict = (location?: string) => {
        if (!location) return '';
        const parts = location.split(',').map((p) => p.trim());
        return parts[2] || '';
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBadge =
            selectedBadge === 'all' ||
            user.badge === selectedBadge;

        const matchesLocation =
            selectedLocation === 'all' ||
            getDistrict(user.location) === selectedLocation;

        const matchesStatus =
            selectedView === "companies"
                ? user.role === "entreprise" &&
                user.status === "accepted" &&
                user.isVerified
                : selectedView === "active"
                    ? user.status === "accepted" &&
                    user.isVerified &&
                    user.role !== "entreprise"
                    : user.status === "pending" ||
                    !user.isVerified;


        return (
            matchesSearch &&
            matchesBadge &&
            matchesLocation &&
            matchesStatus
        );
    });

    const sortedUsers = [...filteredUsers].sort(
        (a, b) => {
            let valueA: any;
            let valueB: any;

            switch (sortField) {
                case 'name':
                    valueA = a.name;
                    valueB = b.name;
                    break;

                case 'points':
                    valueA = a.points || 0;
                    valueB = b.points || 0;
                    break;

                case 'badge':
                    valueA = a.badge || '';
                    valueB = b.badge || '';
                    break;

                case 'location':
                    valueA = a.location || '';
                    valueB = b.location || '';
                    break;

                default:
                    return 0;
            }

            if (valueA < valueB)
                return sortDirection === 'asc'
                    ? -1
                    : 1;

            if (valueA > valueB)
                return sortDirection === 'asc'
                    ? 1
                    : -1;

            return 0;
        }
    );

    const totalPages = Math.ceil(
        sortedUsers.length / USERS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * USERS_PER_PAGE;

    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const totalPoints = users.reduce(
        (sum, user) => sum + (user.points || 0),
        0
    );

    const uniqueLocations = new Set(
        users
            .map((u) => getDistrict(u.location))
            .filter(Boolean)
    ).size;

    const verifiedUsers = users.filter(
        (user) => user.isVerified
    ).length;

    const verifiedPercentage =
        users.length > 0
            ? Math.round(
                (verifiedUsers / users.length) * 100
            )
            : 0;

    const handleSort = (
        field: string
    ) => {
        if (sortField === field) {
            setSortDirection(
                sortDirection === 'asc'
                    ? 'desc'
                    : 'asc'
            );
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) {
            return 'swap_vert';
        }

        return sortDirection === 'asc'
            ? 'arrow_upward'
            : 'arrow_downward';
    };

    const activeCount = users.filter(
        (u) => u.status === 'accepted' && u.isVerified && u.role === 'particulier'
    ).length;

    const pendingCount = users.filter(
        (u) => u.status === 'pending' || !u.isVerified
    ).length;

    const companiesCount = users.filter(
        (u) => u.role === 'entreprise'
    ).length;

    const badges = [
        'all',
        ...new Set(
            users
                .map((u) => u.badge)
                .filter(Boolean)
        ),
    ];

    const locations = [
        'all',
        ...new Set(
            users
                .map((u) => getDistrict(u.location))
                .filter(Boolean)
        ),
    ];

    const handleEnterpriseDecision = async (
        email: string,
        accepted: boolean
    ) => {
        try {
            await adminService.acceptOrRefuseEnterprise({
                email,
                status: accepted ? "accepted" : "refused",
            });

            await fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const exportUsers = () => {
        const headers = [
            'Name',
            'Email',
            'Phone',
            'Location',
            'CO2Saved',
            'Badge',
            'Status',
            'Points',
        ];

        const rows = filteredUsers.map((u) => [
            u.name,
            u.email,
            u.number,
            u.location,
            u.CO2Saved,
            u.badge,
            u.status,
            u.points ?? 0,
        ]);

        const csv =
            [headers, ...rows]
                .map((r) => r.join(','))
                .join('\n');

        const blob = new Blob([csv], {
            type: 'text/csv',
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
    };

    return (
        <div className="flex min-h-screen bg-surface text-on-surface">

            {/* Main Content */}
            <main className="flex-1 bg-surface p-4 flex flex-col gap-8">
                <div className="space-y-6 p-2 md:p-2 lg:p-2 rounded-2xl">
                    {/* Page Header & Stats */}
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-display-lg font-bold tracking-tight text-on-surface">Users Management</h2>
                            <p className="text-body-lg text-on-surface-variant max-w-xl">Monitor and manage your community members, track
                                their ecological contributions, and verify badges.</p>
                        </div>
                        <div className="flex gap-4 items-center bg-surface-container-low p-2 rounded-2xl">
                            <button
                                onClick={() =>
                                    setSelectedView('active')
                                }
                                className={`px-6 py-3 rounded-xl ${selectedView === 'active'
                                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                                    : 'text-on-surface-variant'
                                    }`}
                            >
                                Active Users ({activeCount})
                            </button>
                            <button
                                onClick={() => setSelectedView('companies')}
                                className={`px-6 py-3 rounded-xl ${selectedView === 'companies'
                                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                                    : 'text-on-surface-variant'
                                    }`}
                            >
                                Companies ({companiesCount})
                            </button>
                            <button
                                onClick={() =>
                                    setSelectedView('pending')
                                }
                                className={`px-6 py-3 rounded-xl ${selectedView === 'pending'
                                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                                    : 'text-on-surface-variant'
                                    }`}
                            >
                                Pending Verification ({pendingCount})
                            </button>
                        </div>
                    </div>
                    {/* Filters & Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-on-surface-variant">Filter Users by:</span>
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedBadge}
                                    onChange={(e) => setSelectedBadge(e.target.value)}
                                    className="flex items-center gap-2 bg-primary-container/10 text-primary px-4 py-2 rounded-full border border-primary/20"
                                >
                                    {badges.map((badge) => (
                                        <option key={badge} value={badge}>
                                            {badge === 'all' ? 'All Badges' : badge}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex-1">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="flex items-center gap-2 bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full hover:bg-surface-container-high cursor-pointer transition-colors"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc === 'all' ? 'All Districts' : loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="flex justify-end gap-2">

                            <button
                                onClick={exportUsers}
                                className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all"
                            >
                                <div className="flex items-center relative space-between gap-y-2">
                                    Export Users Report
                                    <span className="material-symbols-outlined">
                                        download
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Users Table */}
                <div
                    className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(20,29,32,0.04)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th
                                    onClick={() =>
                                        handleSort('name')
                                    }
                                    className="cursor-pointer px-8 py-5"
                                >
                                    <div className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant uppercase">
                                        Member Name
                                        <span className="material-symbols-outlined text-sm">
                                            {getSortIcon('name')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={() =>
                                        handleSort('phone')
                                    }
                                    className="cursor-pointer px-6 py-5"
                                >
                                    <div className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant uppercase">
                                        Phone Number
                                        <span className="material-symbols-outlined text-sm">
                                            {getSortIcon('phone')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={() =>
                                        handleSort('points')
                                    }
                                    className="cursor-pointer px-6 py-5"
                                >
                                    <div className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant uppercase">
                                        Points Balance
                                        <span className="material-symbols-outlined text-sm">
                                            {getSortIcon('points')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={() =>
                                        handleSort('badge')
                                    }
                                    className="cursor-pointer px-6 py-5"
                                >
                                    <div className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant uppercase">
                                        Badge Rank
                                        <span className="material-symbols-outlined text-sm">
                                            {getSortIcon('badge')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={() =>
                                        handleSort('location')
                                    }
                                    className="cursor-pointer px-6 py-5"
                                >
                                    <div className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant uppercase">
                                        Location
                                        <span className="material-symbols-outlined text-sm">
                                            {getSortIcon('location')}
                                        </span>
                                    </div>
                                </th>
                                <th className="px-8 py-5 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-8 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                                                group_off
                                            </span>

                                            <h3 className="text-lg font-bold text-on-surface">
                                                No users found
                                            </h3>

                                            <p className="text-on-surface-variant">
                                                Try changing your filters or search query.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => {
                                    const badge = getBadgeConfig(
                                        user.badge
                                    );

                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-surface-container-low/30 transition-colors group"
                                        >
                                            {/* USER */}
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                user.profileImage
                                                                    ? `${API_URL}${user.profileImage}`
                                                                    : "/default-avatar.png"
                                                            }
                                                            alt={user.name}
                                                            className="w-12 h-12 rounded-2xl object-cover"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-body-lg font-bold text-on-surface">
                                                            {user.name}
                                                        </p>

                                                        <p className="text-label-md text-on-surface-variant opacity-60">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* PHONE */}
                                            <td className="px-6 py-4 text-body-lg text-on-surface-variant">
                                                {user.number?.join(' / ') ||
                                                    '-'}
                                            </td>

                                            {/* POINTS */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-body-lg font-bold text-primary">
                                                        {user.points || 0} pts
                                                    </span>

                                                    <div className="w-24 h-1 bg-surface-container-high rounded-full mt-1">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{
                                                                width: `${Math.min(
                                                                    ((user.points ||
                                                                        0) /
                                                                        1500) *
                                                                    100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* BADGE */}
                                            <td className="px-6 py-4">
                                                <div
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${badge.color}`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {badge.icon}
                                                    </span>

                                                    <span className="text-label-md font-bold">
                                                        {user.badge}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* LOCATION */}
                                            <td className="px-6 py-4 text-body-lg text-on-surface-variant max-w-[250px] truncate">
                                                {user.location ||
                                                    'No location'}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* View Details */}
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        title="View details"
                                                        className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            visibility
                                                        </span>
                                                    </button>

                                                    {/* Enterprise Actions */}
                                                    {user.role === 'entreprise' &&
                                                        user.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEnterpriseDecision(
                                                                            user.email,
                                                                            true
                                                                        )
                                                                    }
                                                                    title="Accept company"
                                                                    className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        check_circle
                                                                    </span>
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleEnterpriseDecision(
                                                                            user.email,
                                                                            false
                                                                        )
                                                                    }
                                                                    title="Reject company"
                                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        cancel
                                                                    </span>
                                                                </button>
                                                            </>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }))}
                        </tbody>
                    </table>
                    {selectedUser && (
                        <UserDetailsModal
                            user={selectedUser}
                            onClose={() =>
                                setSelectedUser(null)
                            }
                        />
                    )}
                    {/* Table Footer / Pagination */}
                    <div className="px-8 py-6 bg-surface-container-low/20 flex justify-between items-center">
                        <p className="text-label-md text-on-surface-variant">
                            Showing{' '}
                            <span className="font-bold text-on-surface">
                                {Math.min(
                                    startIndex + USERS_PER_PAGE,
                                    sortedUsers.length
                                )}
                            </span>
                            /
                            <span className="font-bold text-on-surface">
                                {startIndex + 1}
                            </span>
                            {' '}of{' '}
                            <span className="font-bold text-on-surface">
                                {sortedUsers.length}
                            </span>
                            {' '}platform members
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((p) => p - 1)
                                }
                                className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-20"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_left
                                </span>
                            </button>

                            <div className="flex gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                )
                                    .slice(0, 5)
                                    .map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                            className={`w-8 h-8 rounded-lg ${currentPage === page
                                                ? 'bg-primary text-on-primary'
                                                : 'hover:bg-surface-container-high'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                            </div>

                            <button
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage((p) => p + 1)
                                }
                                className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-20"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Footer Stats / Bento Grid Lite */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="bg-primary-container text-on-primary-container p-6 rounded-[2rem] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-4xl opacity-40"
                                style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                            <span className="text-label-md font-bold bg-on-primary-container/10 px-3 py-1 rounded-full">
                                {users.length} Users
                            </span>
                        </div>
                        <div>
                            <p className="text-display-lg font-bold leading-none">
                                {totalPoints.toLocaleString()}
                            </p>
                            <p className="text-label-md font-medium opacity-80 mt-1 uppercase tracking-wider">Total Eco-Points Distributed
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-container-high p-6 rounded-[2rem] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-4xl text-primary opacity-40"
                                style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            <span className="text-label-md font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">Live</span>
                        </div>
                        <div>
                            <p className="text-display-lg font-bold leading-none text-on-surface">
                                {uniqueLocations}
                            </p>
                            <p className="text-label-md font-medium text-on-surface-variant mt-1 uppercase tracking-wider">Active Cities
                                &amp; Districts</p>
                        </div>
                    </div>
                    <div
                        className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-[2rem] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-4xl text-secondary opacity-40"
                                style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <span className="text-label-md font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                                {verifiedPercentage}%
                            </span>
                        </div>
                        <div>
                            <p className="text-display-lg font-bold leading-none text-on-surface">
                                {verifiedUsers}
                            </p>
                            <p className="text-label-md font-medium text-on-surface-variant mt-1 uppercase tracking-wider">Verified
                                Members</p>
                        </div>
                    </div>
                </div>
            </main >
        </div>
    );
}