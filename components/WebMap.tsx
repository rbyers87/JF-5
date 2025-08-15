import { useEffect } from 'react';
import { View } from 'react-native';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => {
    const L = require('leaflet');
    // Fix leaflet icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const { MapContainer, TileLayer, Marker, Polygon } = require('react-leaflet');
    
    return function Map({ location, jurisdictions }) {
      useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
      }, []);

      return (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.latitude, location.longitude]} />
          {jurisdictions.map((jur) => (
            jur.boundary?.length > 0 && (
              <Polygon
                key={jur.id}
                positions={jur.boundary.map(coord => [coord[1], coord[0]])}
              />
            )
          ))}
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export function WebMap({ location, jurisdictions }) {
  return (
    <View style={{ flex: 1 }}>
      <LeafletMap location={location} jurisdictions={jurisdictions} />
    </View>
  );
}
