import { adminService } from "@/services/adminService";
import { BadgeCriteria } from "@/types/api";


export const getBadgeProgress = async (points: number) => {

    const criteria: BadgeCriteria =
        await adminService.getBadgeCriteria();


    if (points <= criteria.colibriBeeMax) {
        return {
            current: "Colibri Bee",
            currentIcon: "verified",

            next: "Colibri Saphir",
            nextIcon: "energy_savings_leaf",

            currentMin: 0,
            nextThreshold: criteria.colibriSaphirMin,
        };
    }


    if (points <= criteria.colibriSaphirMax) {
        return {
            current: "Colibri Saphir",
            currentIcon: "energy_savings_leaf",

            next: "Colibri Malachite",
            nextIcon: "volunteer_activism",

            currentMin: criteria.colibriSaphirMin,
            nextThreshold: criteria.colibriMalachiteMin,
        };
    }


    return {
        current: "Colibri Malachite",
        currentIcon: "volunteer_activism",

        next: null,
        nextIcon: null,

        currentMin: criteria.colibriMalachiteMin,
        nextThreshold: null,
    };
};



export const getBadges = async () => {

    const criteria: BadgeCriteria =
        await adminService.getBadgeCriteria();


    return [
        {
            name: "Colibri Bee",
            icon: "verified",
            threshold: 0,
            max: criteria.colibriBeeMax,
        },

        {
            name: "Colibri Saphir",
            icon: "energy_savings_leaf",
            threshold: criteria.colibriSaphirMin,
            max: criteria.colibriSaphirMax,
        },

        {
            name: "Colibri Malachite",
            icon: "volunteer_activism",
            threshold: criteria.colibriMalachiteMin,
            max: null,
        },
    ];
};



export const getBadgeConfig = (badge: string) => {
    switch (badge) {
        case "Colibri Saphir":
            return {
                color:
                    "bg-secondary-fixed text-on-secondary-fixed-variant",
                icon:
                    "energy_savings_leaf",
            };

        case "Colibri Malachite":
            return {
                color:
                    "bg-primary-fixed text-on-primary-fixed-variant",
                icon:
                    "volunteer_activism",
            };

        default:
            return {
                color:
                    "bg-surface-container-high text-on-surface",
                icon:
                    "verified_user",
            };
    }
};