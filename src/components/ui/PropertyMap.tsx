import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
    lat: number;
    lng: number;
    title?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ lat, lng, title }) => {
    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md border border-[var(--color-border)] z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {title || "Ubicación de la propiedad"}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
