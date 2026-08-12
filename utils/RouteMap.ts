import { useEffect, useRef } from "react";
import { geocodeAddress } from "./geoCodeUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

type LocationInput = {
    lat?: number | string;
    lng?: number | string;
    userLocation?: string;
    userName?: string;
};

interface RouteMapInitializerProps {
    mapRef: React.RefObject<HTMLDivElement>;
    mapInstanceRef: React.MutableRefObject<any>;
    markerRef: React.MutableRefObject<any>;
    routingControlRef: React.MutableRefObject<any>;
    locations: LocationInput[];
}

const DEFAULT_CENTER: [number, number] = [36.8065, 10.1815]; // Tunis fallback

export function RouteMapInitializer({
    mapRef,
    mapInstanceRef,
    markerRef,
    routingControlRef,
    locations,
}: RouteMapInitializerProps) {
    const LRef = useRef<any>(null);
    const locationMarkersRef = useRef<any[]>([]);

    // Init map once
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        let cancelled = false;
        let resizeObserver: ResizeObserver | null = null;

        Promise.all([import("leaflet"), import("leaflet-routing-machine")])
            .then(([LModule]) => {
                if (cancelled || !mapRef.current) return;

                const L = LModule.default || LModule;
                LRef.current = L;
                (window as any).L = L;

                if (!L.Routing) {
                    console.error("L.Routing is undefined.", L);
                    alert("Erreur: Impossible de charger le module de routage.");
                    return;
                }

                const map = L.map(mapRef.current, {
                    center: DEFAULT_CENTER,
                    zoom: 8,
                    zoomControl: true,
                });
                mapInstanceRef.current = map;

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution:
                        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    crossOrigin: true, // required so the map can be exported as an image
                }).addTo(map);
                resizeObserver = new ResizeObserver(() => map.invalidateSize());
                resizeObserver.observe(mapRef.current);

                requestAnimationFrame(() => map.invalidateSize());
                const t1 = setTimeout(() => map.invalidateSize(), 200);
                const t2 = setTimeout(() => map.invalidateSize(), 500);

                map.on("click", async (e: any) => {
                    const { lat, lng } = e.latlng;

                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        markerRef.current = L.marker([lat, lng], {
                            icon: buildIcon(L, "start"),
                        }).addTo(map);
                    }

                    const stops = await resolveWaypoints(L, locations);
                    await drawRoute(L, map, routingControlRef, [
                        { latLng: L.latLng(lat, lng), name: "Point de départ" },
                        ...stops,
                    ]);
                });

                // Place markers for the pickup locations right away and
                // frame the map around them instead of the hardcoded default.
                placeLocationMarkers(L, map, locationMarkersRef, locations);

                return () => {
                    clearTimeout(t1);
                    clearTimeout(t2);
                };
            })
            .catch((error) => {
                console.error("Error loading Leaflet or leaflet-routing-machine:", error);
                alert("Erreur lors du chargement des bibliothèques de carte");
            });

        return () => {
            cancelled = true;
            resizeObserver?.disconnect();
            locationMarkersRef.current.forEach((m) => m.remove());
            locationMarkersRef.current = [];
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
                routingControlRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-place markers (and re-fit) whenever the location list changes,
    // without touching any route the user may have already generated.
    useEffect(() => {
        const L = LRef.current;
        const map = mapInstanceRef.current;
        if (!L || !map) return;

        placeLocationMarkers(L, map, locationMarkersRef, locations);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locations]);

    return null;
}

// ---- helpers ----

function buildIcon(L: any, kind: "start" | "stop") {
    return L.icon({
        iconUrl:
            kind === "start"
                ? "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
                : "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
        iconSize: kind === "start" ? [25, 41] : [20, 32],
        iconAnchor: kind === "start" ? [12, 41] : [10, 32],
    });
}

async function resolveWaypoints(L: any, locations: any[]) {
    const waypoints: any[] = [];

    for (const loc of locations) {
        let coordinates;

        if (loc.lat && loc.lng) {
            coordinates = { lat: Number(loc.lat), lng: Number(loc.lng) };
        } else {
            coordinates = await geocodeAddress(loc.userLocation);
        }

        if (coordinates?.lat && coordinates?.lng) {
            waypoints.push({
                latLng: L.latLng(coordinates.lat, coordinates.lng),
                name: loc.userName,
            });
        } else {
            console.warn(`No geocoding results for location: ${loc.userLocation}`);
        }
    }

    return waypoints;
}

async function placeLocationMarkers(
    L: any,
    map: any,
    locationMarkersRef: React.MutableRefObject<any[]>,
    locations: any[]
) {
    // Clear previous markers before redrawing
    locationMarkersRef.current.forEach((m) => m.remove());
    locationMarkersRef.current = [];

    if (!locations.length) return;

    const waypoints = await resolveWaypoints(L, locations);
    if (!waypoints.length) return;

    waypoints.forEach((wp, i) => {
        const marker = L.marker(wp.latLng, { icon: buildIcon(L, "stop") })
            .addTo(map)
            .bindPopup(`<strong>${i + 1}. ${wp.name ?? "Pickup"}</strong>`);
        locationMarkersRef.current.push(marker);
    });

    // Adjust the default center/zoom to fit every pickup location
    if (waypoints.length === 1) {
        map.setView(waypoints[0].latLng, 14);
    } else {
        map.fitBounds(L.latLngBounds(waypoints.map((wp) => wp.latLng)), {
            padding: [40, 40],
        });
    }
}

async function drawRoute(
    L: any,
    map: any,
    routingControlRef: React.MutableRefObject<any>,
    waypoints: any[]
) {
    if (!waypoints.length) return;

    if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        showAlternatives: true,
        lineOptions: { styles: [{ color: "#1890ff", weight: 4 }] },
        createMarker: (i: number, waypoint: any) =>
            L.marker(waypoint.latLng, { icon: buildIcon(L, i === 0 ? "start" : "stop") }),
    }).addTo(map);

    map.fitBounds(L.latLngBounds(waypoints.map((wp) => wp.latLng)), {
        padding: [40, 40],
    });
}