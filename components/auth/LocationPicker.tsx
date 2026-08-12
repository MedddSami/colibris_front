'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
    onLocationSelect: (
        address: string,
        lat: string,
        lng: string
    ) => void;
}

export default function LocationPicker({
    onLocationSelect,
}: LocationPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [error, setError] = useState('');

    // -----------------------------
    // Reverse geocode (frontend only)
    // -----------------------------
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: {
                        Accept: 'application/json',
                        'User-Agent': 'ColibrisApp/1.0 (contact@colibris.com)',
                    },
                }
            );

            if (!res.ok) throw new Error('Reverse geocoding failed');

            const data = await res.json();

            return data.display_name || `${lat}, ${lng}`;
        } catch {
            return `${lat}, ${lng}`;
        }
    };

    // -----------------------------
    // Init Map
    // -----------------------------
    useEffect(() => {
        if (!showMap || !mapContainerRef.current || mapRef.current) return;

        let isMounted = true;

        (async () => {
            const L = (await import('leaflet')).default;
            if (!isMounted) return;

            const container = mapContainerRef.current;
            if (!container) return;

            mapRef.current = L.map(container).setView(
                [36.866667, 10.166667],
                8
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapRef.current);

            // ✅ Fix default markers (NEXT.js safe)
            delete (L.Icon.Default.prototype as any)._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            });

            // -----------------------------
            // Map click
            // -----------------------------
            mapRef.current.on('click', async (e: any) => {
                const { lat, lng } = e.latlng;

                // marker
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
                }

                const address = await reverseGeocode(lat, lng);

                setSelectedLocation(address);
                setError('');

                onLocationSelect(
                    address,
                    lat.toString(),
                    lng.toString()
                );
            });

            setTimeout(() => {
                mapRef.current?.invalidateSize();
            }, 200);
        })();

        return () => {
            isMounted = false;

            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, [showMap, onLocationSelect]);

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setShowMap((p) => !p)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface"
            >
                {showMap ? 'Hide Map' : 'Choose Location on Map'}
            </button>

            {/*{selectedLocation && (
                <div className="rounded-lg bg-green-50 p-3 text-sm">
                    <span className="font-medium">Selected:</span>{' '}
                    {selectedLocation}
                </div>
            )}*/}

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            {showMap && (
                <div
                    ref={mapContainerRef}
                    className="h-[350px] w-full rounded-xl overflow-hidden border"
                />
            )}
        </div>
    );
}