import React from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Jurisdiction } from '@/types';

export default function UniversalMap({ 
  location, 
  jurisdictions 
}: { 
  location: { latitude: number; longitude: number }, 
  jurisdictions: Jurisdiction[] 
}) {
  // Platform-specific rendering
  if (Platform.OS === 'web') {
    const WebMap = require('@/components/WebLeafletMap.web').default;
    return <WebMap location={location} jurisdictions={jurisdictions} />;
  } else {
    const NativeMap = require('@/components/NativeExpoMap').default;
    return <NativeMap location={location} jurisdictions={jurisdictions} />;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
