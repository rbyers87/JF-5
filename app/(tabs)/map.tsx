import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as Location from 'expo-location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { Jurisdiction } from '@/types';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }
        
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
        
        const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        
        if (jurisdictionData) {
          setJurisdictions([{
            id: jurisdictionData.primaryAgency.name,
            name: jurisdictionData.primaryAgency.name,
            type: jurisdictionData.jurisdiction,
            boundary: jurisdictionData.boundary || [],
            nonEmergencyNumber: jurisdictionData.primaryAgency.phone || '',
            website: jurisdictionData.primaryAgency.website || ''
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

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

  if (Platform.OS === 'web') {
    const WebMap = require('@/components/WebMap.web').default;
    return <WebMap location={location} jurisdictions={jurisdictions} />;
  } else {
    const NativeMap = require('@/components/NativeMap').default;
    return <NativeMap location={location} jurisdictions={jurisdictions} />;
  }
}

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
