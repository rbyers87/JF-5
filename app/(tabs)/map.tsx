import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as Location from 'expo-location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { Jurisdiction } from '@/types';

// Import components directly (no dynamic requires)
import { WebMap } from '@/components/WebMap';
import { NativeMap } from '@/components/NativeMap';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1. Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }
        
        // 2. Get current position
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
        
        // 3. Fetch jurisdiction data
        const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        
        // 4. Process jurisdiction data
        if (jurisdictionData) {
          setJurisdictions([{
            id: jurisdictionData.primaryAgency.name,
            name: jurisdictionData.primaryAgency.name,
            type: jurisdictionData.jurisdiction,
            boundary: jurisdictionData.boundary || [],
            nonEmergencyNumber: jurisdictionData.primaryAgency.phone || '',
            website: jurisdictionData.primaryAgency.website || '',
            // Preserve all original properties
            ...jurisdictionData.primaryAgency
          }]);
        }
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  // Error states
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Location not available</Text>
      </View>
    );
  }

  // Render the appropriate map component
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebMap 
          location={location} 
          jurisdictions={jurisdictions}
          // Pass any additional web-specific props here
        />
      ) : (
        <NativeMap 
          location={location} 
          jurisdictions={jurisdictions}
          // Pass any additional native-specific props here  
        />
      )}
    </View>
  );
}

// Keep all your original styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    textAlign: 'center',
  }
});
