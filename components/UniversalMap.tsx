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
          jur.boundary && jur.boundary.length > 0 && (
            <Polygon
              key={jur.id}
              coordinates={jur.boundary.map(coord => ({
                latitude: coord[1], // Convert from [long, lat] to lat
                longitude: coord[0] // Convert from [long, lat] to long
              }))}
              fillColor="rgba(30, 64, 175, 0.3)"
              strokeColor="rgba(30, 64, 175, 0.8)"
              strokeWidth={2}
            />
          )
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
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import the web map component
    const loadMap = async () => {
      try {
        const { default: WebLeafletMap } = await import('@/components/WebLeafletMap');
        setMapComponent(() => WebLeafletMap);
      } catch (error) {
        console.error('Failed to load web map:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMap();
    
    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.fallbackContainer}>
        <p>Loading map...</p>
      </div>
    );
  }

  if (!MapComponent) {
    return (
      <div style={styles.fallbackContainer}>
        <p>Map not available. Please try again later.</p>
      </div>
    );
  }

  return <MapComponent location={location} jurisdictions={jurisdictions} />;
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f3f4f6',
    padding: 20,
    textAlign: 'center',
  }
});
