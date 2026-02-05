// OpenStreetMap embed (no Leaflet dependency, works with React 19)
export function DetectionMap({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 h-48 w-full bg-slate-100 dark:bg-slate-800">
      <iframe
        title="Detected location"
        src={embedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-2">
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Open in OpenStreetMap
        </a>
      </p>
    </div>
  );
}
