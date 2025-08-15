import React from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Jurisdiction } from '@/types';

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function WebLeafletMap({ 
  location, 
  jurisdictions 
}: { 
  location: { latitude: number; longitude: number };
  jurisdictions: Jurisdiction[];
}) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>Your Location</Popup>
        </Marker>
        {jurisdictions.map((jur) => (
          jur.boundary && jur.boundary.length > 0 && (
            <Polygon
              key={jur.id}
              positions={jur.boundary.map(coord => [coord[1], coord[0]])} // Convert to [lat, long]
              pathOptions={{ color: '#1e40af', fillOpacity: 0.3 }}
            />
          )
        ))}
      </MapContainer>
    </div>
  );
}
