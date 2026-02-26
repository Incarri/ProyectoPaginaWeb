import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L, { type LeafletMouseEvent, type LatLngExpression } from 'leaflet';

type Coordinates = { lat: number; lng: number };

type Props = {
  query: string;
  coordinates: Coordinates | null;
  onCoordinatesChange: (coords: Coordinates | null) => void;
  onLocationChange: (location: string) => void;
};

const LIMA_CENTER: Coordinates = { lat: -12.0464, lng: -77.0428 };

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function RecenterOnCoordinates({ coordinates }: { coordinates: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates) return;
    map.setView([coordinates.lat, coordinates.lng], 16, { animate: true });
  }, [coordinates, map]);

  return null;
}

export function LocationPickerMap({
  query,
  coordinates,
  onCoordinatesChange,
  onLocationChange,
}: Props) {
  const [isResolving, setIsResolving] = useState(false);

  const center = useMemo<LatLngExpression>(() => coordinates ?? LIMA_CENTER, [coordinates]);

  useEffect(() => {
    if (!query.trim()) return;
    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          limit: '1',
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
        const data = (await response.json()) as Array<{ lat: string; lon: string }>;
        if (!data.length) return;
        onCoordinatesChange({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
      } catch {
        // Ignore network failures and keep current marker.
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, onCoordinatesChange]);

  const handleMapSelect = async (lat: number, lng: number) => {
    onCoordinatesChange({ lat, lng });
    setIsResolving(true);
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: 'json',
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
      const data = (await response.json()) as { display_name?: string };
      if (data?.display_name) {
        onLocationChange(data.display_name);
      }
    } catch {
      // Keep manual location text if reverse geocoding fails.
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={14} className="w-full h-64 md:h-80" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnCoordinates coordinates={coordinates} />
        <MapClickHandler onSelect={handleMapSelect} />
        {coordinates && <Marker position={coordinates} />}
      </MapContainer>
      <div className="px-3 py-2 text-xs text-gray-600 bg-gray-50 border-t">
        {isResolving ? 'Obteniendo direccion...' : 'Haz click en el mapa para autocompletar la ubicacion.'}
      </div>
    </div>
  );
}
