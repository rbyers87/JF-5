import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Jurisdiction } from '@/types';

// Native Map Implementation
const NativeMap = ({ location, jurisdictions }: { 
  location: { latitude: number; longitude: number }, 
  jurisdictions: Jurisdiction[] 
}) => {
  const MapView = require('expo-maps').MapView;
  const Marker = require('expo-maps').Marker;
  const Polygon = require('expo-maps').Polygon;

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker 
          coordinate={location} 
          title="Your Location" 
          pinColor="#1e40af"
        />
        {jurisdictions.map((jur) => (
          <Polygon
            key={jur.id}
            coordinates={jur.boundary.map(coord => ({
              latitude: coord[1],
              longitude: coord[0]
            }))}
            fillColor="rgba(30, 64, 175, 0.3)"
            strokeColor="rgba(30, 64, 175, 0.8)"
            strokeWidth={2}
          />
        ))}
      </MapView>
    </View>
  );
};

// Web Map Implementation
const WebMap = ({ location, jurisdictions }: { 
  location: { latitude: number; longitude: number }, 
  jurisdictions: Jurisdiction[] 
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!isClient) {
    return (
      <div style={styles.fallbackContainer}>
        <p>Loading map...</p>
      </div>
    );
  }

  // Dynamically import Leaflet components
  const { MapContainer, TileLayer, Marker, Polygon, Popup } = require('react-leaflet');
  const L = require('leaflet');

  // Fix marker icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

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
          <Polygon
            key={jur.id}
            positions={jur.boundary.map(coord => [coord[1], coord[0])}
            pathOptions={{ color: '#1e40af', fillOpacity: 0.3 }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

// Main Universal Map Component
export default function UniversalMap({ location, jurisdictions }: { 
  location: { latitude: number; longitude: number }, 
  jurisdictions: Jurisdiction[] 
}) {
  if (Platform.OS === 'web') {
    return <WebMap location={location} jurisdictions={jurisdictions} />;
  }
  
  return <NativeMap location={location} jurisdictions={jurisdictions} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f3f4f6',
  }
});
