import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

type RouteLocation = {
    reservationId?: string;
    userName?: string;
    userLocation?: string;
    lat?: string | number;
    lng?: string | number;
    phone?: string | null;
    collectionType?: string | null;
    estimatedVolume?: string | null;
    selectedTime?: string | null;
    status?: string;
};

export async function exportMapAsImage(
    mapContainer: HTMLDivElement,
    filename = "pickup-route-map.png"
) {
    try {
        const canvas = await html2canvas(mapContainer, {
            useCORS: true,
            allowTaint: false,
            logging: false,
        });

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    } catch (err) {
        console.error("Map export failed:", err);
        throw err; // let the caller show a toast
    }
}

export function exportLocationsAsCSV(
    locations: RouteLocation[],
    filename = "pickup-route.csv"
) {
    const headers = [
        "#",
        "Name",
        "Address",
        "Phone",
        "Collection Type",
        "Volume",
        "Time Slot",
        "Status",
        "Lat",
        "Lng",
    ];

    const rows = locations.map((loc, i) => [
        i + 1,
        loc.userName ?? "",
        loc.userLocation ?? "",
        loc.phone ?? "",
        loc.collectionType ?? "",
        loc.estimatedVolume ?? "",
        loc.selectedTime ?? "",
        loc.status ?? "",
        loc.lat ?? "",
        loc.lng ?? "",
    ]);

    const csv = [headers, ...rows]
        .map((row) =>
            row
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export async function exportRouteAsPDF(
    mapContainer: HTMLDivElement,
    locations: RouteLocation[],
    routeDate: Date,
    filename = "pickup-route.pdf"
) {
    const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: false,
        logging: false,
    });
    const mapImgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;

    pdf.setFontSize(18);
    pdf.text("Pickup Route", margin, 50);

    pdf.setFontSize(11);
    pdf.setTextColor(100);
    pdf.text(
        `Date: ${routeDate.toLocaleDateString()} — ${locations.length} pickup(s)`,
        margin,
        68
    );

    // Map image
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    pdf.addImage(mapImgData, "PNG", margin, 85, imgWidth, imgHeight);

    // Location list below the map
    let y = 85 + imgHeight + 30;
    pdf.setFontSize(13);
    pdf.setTextColor(0);
    pdf.text("Pickup List", margin, y);
    y += 18;

    pdf.setFontSize(9.5);
    locations.forEach((loc, i) => {
        if (y > pdf.internal.pageSize.getHeight() - 60) {
            pdf.addPage();
            y = 50;
        }

        pdf.setTextColor(0);
        pdf.text(`${i + 1}. ${loc.userName ?? "Customer"}`, margin, y);
        y += 13;

        pdf.setTextColor(90);
        pdf.text(`${loc.userLocation ?? ""}`, margin + 12, y);
        y += 13;

        const meta = [
            loc.selectedTime,
            loc.collectionType,
            loc.estimatedVolume,
            loc.phone,
        ]
            .filter(Boolean)
            .join("  •  ");

        if (meta) {
            pdf.text(meta, margin + 12, y);
            y += 13;
        }

        y += 6;
    });

    pdf.save(filename);
}