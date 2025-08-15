import React, { useState, useEffect } from 'react';
    import { Platform, View, Text, StyleSheet } from 'react-native';
    import { LocationData } from '@/types/location';
    import { JurisdictionService } from '@/services/jurisdictionService';
    import { getCurrentLocation } from '@/services/locationService';
    import type { LocationObject } from '@/services/locationService';
    
    // Platform-specific map components
    let MapComponent: React.ComponentType<any>;
    
    if (Platform.OS === 'web') {
      try {
        // Dynamically import web map component
        const WebMapModule = require('./map.web');
        MapComponent = WebMapModule.default;
      } catch (error) {
        console.warn('Web map component not found, using fallback');
        MapComponent = FallbackMap;
      }
    } else {
      try {
        // Dynamically import native map component
        const NativeMapModule = require('./map.native');
        MapComponent = NativeMapModule.default;
      } catch (error) {
        console.warn('Native map component not found, using fallback');
        MapComponent = FallbackMap;
      }
    }
    
    // Fallback component when platform-specific components aren't available
    function FallbackMap() {
      const [location, setLocation] = useState<LocationObject | null>(null);
      const [locationData, setLocationData] = useState<LocationData | null>(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const loadLocationData = async () => {
          try {
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);
    
            const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
              currentLocation.coords.latitude,
              currentLocation.coords.longitude
            );
            setLocationData(jurisdictionData);
          } catch (error) {
            console.error('Failed to load location data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        loadLocationData();
      }, []);
    
      if (loading) {
        return (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Loading map...</Text>
          </View>
        );
      }
    
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Map View</Text>
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                Current Location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
              </Text>
              {locationData && (
                <Text style={styles.jurisdictionText}>
                  Jurisdiction: {locationData.primaryAgency.name}
                </Text>
              )}
            </View>
          )}
          <Text style={styles.fallbackMessage}>
            {Platform.OS === 'web'
              ? 'Web map component not available. Please check your Leaflet installation.'
              : 'Native map component not available. Please check your expo-maps installation.'
            }
          </Text>
        </View>
      );
    }
    
    // Main export - uses platform-specific component or fallback
    export default function MapScreen() {
      return <MapComponent />;
    }
    
    const styles = StyleSheet.create({
      fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f3f4f6',
      },
      fallbackTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1f2937',
      },
      locationInfo: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      locationText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 8,
      },
      jurisdictionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
      },
      fallbackText: {
        fontSize: 18,
        color: '#6b7280',
      },
      fallbackMessage: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        fontStyle: 'italic',
      },
    });
