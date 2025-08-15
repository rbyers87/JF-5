import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapView, Marker, Polygon } from 'expo-maps';
import { Jurisdiction } from '@/types';

export default function NativeMap({ 
  location, 
  jurisdictions 
}: { 
  location: { latitude: number; longitude: number }, 
  jurisdictions: Jurisdiction[] 
}) {
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
                latitude: coord[1],
                longitude: coord[0]
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
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
