export const parseDDMMYYYY = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);


    return {
        day,
        month,
        year,
    };
};

export const normalizeCollections = (collections: any[]) => {
    return collections.map((c) => {
        const { day, month, year } = parseDDMMYYYY(c.date);

        // Build a PURE string key (no Date object)
        const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        return {
            ...c,
            isoDate,
            dateParts: { day, month, year },
        };
    });
};