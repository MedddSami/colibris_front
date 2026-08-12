const geocodeCache = new Map();
const mapsLinkCache = new Map();

const saveCaches = () => {
    const geocodeCacheWithExpiry = Array.from(geocodeCache.entries())
        .filter(
            ([key, value]) =>
                key &&
                value &&
                value.lat &&
                value.lng &&
                !isNaN(value.lat) &&
                !isNaN(value.lng)
        )
        .map(([key, value]) => ({
            key,
            value,
            expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        }));
    localStorage.setItem("geocodeCache", JSON.stringify(geocodeCacheWithExpiry));

    const mapsLinkCacheWithExpiry = Array.from(mapsLinkCache.entries())
        .filter(
            ([key, value]) =>
                key &&
                value &&
                value.googleMapsUrl &&
                value.googleMapsUrl !== "Inconnu" &&
                value.googleMapsUrl.includes("https://www.google.com/maps/search/")
        )
        .map(([key, value]) => ({
            key,
            value,
            expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        }));
    localStorage.setItem(
        "mapsLinkCache",
        JSON.stringify(mapsLinkCacheWithExpiry)
    );
};

const loadCaches = () => {
    try {
        const geocodeCached = JSON.parse(
            localStorage.getItem("geocodeCache") || "[]"
        );
        const now = Date.now();
        geocodeCached.forEach(({ key, value, expiry }, index) => {
            if (
                key &&
                value &&
                typeof value === "object" &&
                expiry > now &&
                value.lat &&
                value.lng &&
                !isNaN(value.lat) &&
                !isNaN(value.lng)
            ) {
                geocodeCache.set(key, value);
            } else {
                console.warn(
                    `Skipping invalid/expired geocode cache entry at index ${index}:`,
                    { key, value, expiry }
                );
            }
        });

        const mapsLinkCached = JSON.parse(
            localStorage.getItem("mapsLinkCache") || "[]"
        );
        mapsLinkCached.forEach(({ key, value, expiry }, index) => {
            if (
                key &&
                value &&
                typeof value === "object" &&
                expiry > now &&
                value.googleMapsUrl &&
                value.googleMapsUrl !== "Inconnu" &&
                value.googleMapsUrl.includes("https://www.google.com/maps/search/")
            ) {
                mapsLinkCache.set(key, value);
            } else {
                console.warn(
                    `Skipping invalid/expired maps link cache entry at index ${index}:`,
                    { key, value, expiry }
                );
            }
        });
    } catch (error) {
        console.error("Error loading caches, resetting:", error.message);
        localStorage.removeItem("geocodeCache");
        localStorage.removeItem("mapsLinkCache");
        geocodeCache.clear();
        mapsLinkCache.clear();
    }
};

loadCaches();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const commonAddresses = [
    "Tunis, Gouvernorat Tunis, Tunisie",
    "Sfax, Gouvernorat Sfax, Tunisie",
    "Sousse, Gouvernorat Sousse, Tunisie",
    "Ariana, Gouvernorat Ariana, Tunisie",
    "Ben Arous, Gouvernorat Ben Arous, Tunisie",
    "Cité Ennassim, Oued Ellil, Gouvernorat La Manouba, Tunisie",
    "Es Saida, Oued Ellil, Gouvernorat La Manouba, Tunisie",
    "Bizerte, Gouvernorat Bizerte, Tunisie",
    "Gabès, Gouvernorat Gabès, Tunisie",
    "Kairouan, Gouvernorat Kairouan, Tunisie",
    "Rue de l’Esthétique, Cite El Izdihar, El Ouardia, Tunis, Tunisie",
    "Chebeda, Fouchana, Gouvernorat Ben Arous, Tunisie",
];

function normalizeAddress(address) {
    if (!address) return address;
    return address
        .replace(/,\s*,/g, ",") // Remove empty commas
        .replace(/[,;]\s*/g, ", ") // Standardize separators
        .replace(/\s+/g, " ") // Collapse spaces
        .trim();
}

function generateGoogleMapsLink(address, forceRegenerate = false) {
    if (!address || address === "N/A" || address.trim() === "") {
        console.warn(`Invalid or empty address for Google Maps link: "${address}"`);
        return {
            googleMapsUrl: "Inconnu",
            formattedAddress: address || "N/A",
        };
    }

    const normalizedAddress = normalizeAddress(address).toLowerCase();
    if (!forceRegenerate && mapsLinkCache.has(normalizedAddress)) {
        const cached = mapsLinkCache.get(normalizedAddress);
        return cached;
    }

    try {
        const encodedAddress = encodeURIComponent(normalizeAddress(address));
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        const result = {
            googleMapsUrl,
            formattedAddress: address,
        };
        mapsLinkCache.set(normalizedAddress, result);
        saveCaches();
        return result;
    } catch (error) {
        console.error(
            `Error generating Google Maps link for "${address}":`,
            error.message
        );
        return {
            googleMapsUrl: "Inconnu",
            formattedAddress: address,
        };
    }
}

async function geocodeAddress(
    address,
    useOpenCage = true,
    strictCountry = true,
    retryCount = 0
) {
    if (!address || address === "N/A" || address.trim() === "") {
        console.warn(`Invalid or empty address provided: "${address}"`);
        return {
            formattedAddress: address || "N/A",
            lat: null,
            lng: null,
        };
    }

    const normalizedAddress = normalizeAddress(address).toLowerCase();
    if (geocodeCache.has(normalizedAddress)) {
        const cached = geocodeCache.get(normalizedAddress);
        if (cached.lat && cached.lng && !isNaN(cached.lat) && !isNaN(cached.lng)) {
            return cached;
        }
        console.warn(
            `Invalid cached coordinates for ${normalizedAddress}:`,
            cached
        );
        geocodeCache.delete(normalizedAddress);
    }

    const maxRetries = 3;
    const maxDelay = 8000;

    try {
        let formattedAddress = address;
        let lat = null;
        let lng = null;

        if (useOpenCage) {
            const apiKey =
                process.env.REACT_APP_OPENCAGE_API_KEY || "YOUR_OPENCAGE_API_KEY";
            if (!apiKey || apiKey === "YOUR_OPENCAGE_API_KEY") {
                console.warn(
                    "No valid OpenCage API key provided, falling back to Nominatim"
                );
                return await geocodeAddress(address, false, strictCountry, retryCount);
            }

            const encodedAddress = encodeURIComponent(normalizeAddress(address));
            let url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${apiKey}&language=fr&limit=1`;
            if (strictCountry) url += "&countrycode=tn";

            const response = await fetch(url, {
                headers: { "User-Agent": "ColibrisApp/1.0 (contact@colibrisapp.com)" },
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const delay = Math.min(Math.pow(2, retryCount) * 1000, maxDelay);
                    console.warn(
                        `Rate limit reached for OpenCage on address: "${address}", retrying after ${delay}ms`
                    );
                    await sleep(delay);
                    if (retryCount < maxRetries) {
                        return await geocodeAddress(
                            address,
                            true,
                            strictCountry,
                            retryCount + 1
                        );
                    }
                    throw new Error("Rate limit exceeded after retries");
                }
                throw new Error(
                    `OpenCage API error: ${response.status} - ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log(
                `OpenCage response for "${address}" (strictCountry=${strictCountry}):`,
                data
            );

            if (data.results.length > 0) {
                const rawLat = data.results[0].geometry.lat;
                const rawLng = data.results[0].geometry.lng;
                lat = parseFloat(rawLat);
                lng = parseFloat(rawLng);

                if (isNaN(lat) || isNaN(lng) || lat === null || lng === null) {
                    console.warn(
                        `Invalid coordinates from OpenCage for "${address}": lat=${rawLat}, lng=${rawLng}`
                    );
                    throw new Error("Invalid coordinates returned by OpenCage");
                }

                if (lat < 30 || lat > 37.5 || lng < 7.5 || lng > 11.6) {
                    console.warn(
                        `Coordinates out of Tunisia bounds for "${address}": lat=${lat}, lng=${lng}`
                    );
                    throw new Error("Coordinates outside Tunisia bounds");
                }

                formattedAddress = data.results[0].formatted || address;
            } else {
                console.warn(
                    `No geocoding results from OpenCage for address: "${address}"`
                );
                if (strictCountry && retryCount === 0) {
                    console.log(
                        `Retrying OpenCage without country restriction for "${address}"`
                    );
                    return await geocodeAddress(address, true, false, retryCount + 1);
                }
                throw new Error("No results from OpenCage");
            }
        } else {
            const encodedAddress = encodeURIComponent(normalizeAddress(address));
            const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1${strictCountry ? "&countrycodes=tn" : ""
                }`;
            const response = await fetch(url, {
                headers: { "User-Agent": "ColibrisApp/1.0 (contact@colibrisapp.com)" },
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const delay = Math.min(Math.pow(2, retryCount) * 1000, maxDelay);
                    console.warn(
                        `Rate limit reached for Nominatim on address: "${address}", retrying after ${delay}ms`
                    );
                    await sleep(delay);
                    if (retryCount < maxRetries) {
                        return await geocodeAddress(
                            address,
                            false,
                            strictCountry,
                            retryCount + 1
                        );
                    }
                    throw new Error("Rate limit exceeded after retries");
                }
                throw new Error(
                    `Nominatim API error: ${response.status} - ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log(`Nominatim response for "${address}":`, data);

            if (data.length > 0) {
                const rawLat = data[0].lat;
                const rawLng = data[0].lon;
                lat = parseFloat(rawLat);
                lng = parseFloat(rawLng);

                if (isNaN(lat) || isNaN(lng) || lat === null || lng === null) {
                    console.warn(
                        `Invalid coordinates from Nominatim for "${address}": lat=${rawLat}, lng=${rawLng}`
                    );
                    throw new Error("Invalid coordinates returned by Nominatim");
                }

                if (lat < 30 || lat > 37.5 || lng < 7.5 || lng > 11.6) {
                    console.warn(
                        `Coordinates out of Tunisia bounds for "${address}": lat=${lat}, lng=${lng}`
                    );
                    throw new Error("Coordinates outside Tunisia bounds");
                }

                formattedAddress = data[0].display_name || address;
            } else {
                console.warn(
                    `No geocoding results from Nominatim for address: "${address}"`
                );
                throw new Error("No results from Nominatim");
            }
        }

        const result = { formattedAddress, lat, lng };
        geocodeCache.set(normalizedAddress, result);
        saveCaches();
        console.log(`Geocoded address "${address}":`, result);
        return result;
    } catch (error) {
        console.error(
            `Error geocoding address "${address}" (useOpenCage=${useOpenCage}, strictCountry=${strictCountry}, retryCount=${retryCount}):`,
            error.message
        );
        if (useOpenCage && retryCount < maxRetries) {
            console.log(`Falling back to Nominatim for "${address}"`);
            return await geocodeAddress(
                address,
                false,
                strictCountry,
                retryCount + 1
            );
        }
        return {
            formattedAddress: address,
            lat: null,
            lng: null,
        };
    }
}

async function batchGeocodeAddresses(addresses, forceRegenerateLinks = false) {
    const uniqueAddresses = [
        ...new Set(
            addresses.filter((addr) => addr && addr !== "N/A" && addr.trim() !== "")
        ),
    ];
    const results = [];
    const failedAddresses = [];
    for (const address of uniqueAddresses) {
        const linkResult = generateGoogleMapsLink(address, forceRegenerateLinks);
        const geocodeResult = await geocodeAddress(address);
        const result = {
            ...geocodeResult,
            googleMapsUrl: linkResult.googleMapsUrl,
            formattedAddress:
                linkResult.formattedAddress || geocodeResult.formattedAddress,
        };
        results.push(result);
        if (result.googleMapsUrl === "Inconnu") {
            console.warn(
                `Failed to generate Google Maps link for address: "${address}"`
            );
            failedAddresses.push(address);
        }
        await sleep(500);
    }
    if (failedAddresses.length > 0) {
        console.log(
            `Failed to generate links for ${failedAddresses.length} addresses:`,
            failedAddresses
        );
    }
    return results;
}

async function preloadCommonAddresses() {
    for (const address of commonAddresses) {
        const normalizedAddress = normalizeAddress(address).toLowerCase();
        if (!mapsLinkCache.has(normalizedAddress)) {
            generateGoogleMapsLink(address, true);
        }
        if (!geocodeCache.has(normalizedAddress)) {
            await geocodeAddress(address);
        }
    }
}

function clearCaches() {
    geocodeCache.clear();
    mapsLinkCache.clear();
    localStorage.removeItem("geocodeCache");
    localStorage.removeItem("mapsLinkCache");
    console.log("All caches cleared");
}

if (typeof window !== "undefined") {
    preloadCommonAddresses();
}

export {
    geocodeAddress,
    generateGoogleMapsLink,
    batchGeocodeAddresses,
    geocodeCache,
    mapsLinkCache,
    preloadCommonAddresses,
    clearCaches,
};
