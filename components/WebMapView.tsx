import React, { useEffect } from 'react';
import { View } from 'react-native';
import dynamic from 'next/dynamic';

// This will only be loaded on the client side
const MapComponent = dynamic(
  () => import('@/components/LeafletMap'),
  { ssr: false }
);

export default function WebMapView({ location, jurisdictions }) {
  return (
    <View style={{ flex: 1 }}>
      <MapComponent location={location} jurisdictions={jurisdictions} />
    </View>
  );
}
